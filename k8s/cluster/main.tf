module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "6.6.1"

  name            = "${var.project_name}-vpc"
  cidr            = var.vpc_cidr
  azs             = local.azs
  private_subnets = [for index, value in local.azs : cidrsubnet(var.vpc_cidr, 4, index)]
  public_subnets  = [for index, value in local.azs : cidrsubnet(var.vpc_cidr, 8, index + 112)]

  private_subnet_tags = {
    "karpenter.sh/discovery" = "${var.project_name}-eks-cluster"
  }

  enable_dns_hostnames = true
  enable_dns_support   = true

  enable_nat_gateway     = true
  single_nat_gateway     = true
  one_nat_gateway_per_az = false

  tags = {
    Project      = var.project_name
    ResourceType = "Networking"
    ManagedBy    = "OpenTofu"
  }
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "21.18.0"

  name               = "${var.project_name}-eks-cluster"
  kubernetes_version = "1.35"

  endpoint_private_access                  = true
  endpoint_public_access                   = true
  authentication_mode                      = "API" # forces auth via access entries
  enable_cluster_creator_admin_permissions = true

  # disable EKS Auto Mode
  compute_config = {
    enabled = false
  }

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  addons = {
    # eks-pod-identity-agent must be installed before compute (before_compute = true)
    # because it needs to be present on nodes when they join.
    # vpc-cni and kube-proxy are intentionally omitted; Cilium replaces both of them.
    # coredns is intentionally omitted here — it requires nodes to be Ready before
    # it can schedule, so it is managed separately after the node group is created.
    eks-pod-identity-agent = {
      before_compute = true
    }
  }

  node_security_group_tags = {
    "karpenter.sh/discovery" = "${var.project_name}-eks-cluster"
  }

  cluster_tags = {
    Name         = "${var.project_name}-eks-cluster"
    Project      = var.project_name
    ResourceType = "Compute"
    ManagedBy    = "OpenTofu"
  }
}

resource "helm_release" "cilium" {
  name = "cilium"
  namespace = "kube-system"
  repository = "oci://quay.io/cilium/charts"
  chart = "cilium"
  version = "1.19.3"
  # wait=false is intentional. Cilium pods cannot become Ready until nodes exist,
  # but nodes depend on Cilium manifests being present. Setting wait=false breaks
  # this deadlock — manifests are applied to the API server immediately, and Cilium
  # becomes Ready naturally once the node group is created.
  wait = false

  values = [
    yamlencode({
      operator = {
        # The Cilium operator is a Deployment, not a DaemonSet.
        # Unlike DaemonSets, Deployments do not automatically tolerate node taints.
        # Without this toleration, the operator cannot schedule on the tainted nodes,
        # which means Cilium never initializes, network-unavailable taint is never
        # removed, and coredns stays pending forever.
        tolerations = [{
          key = "CriticalAddonsOnly"
          operator = "Equal"
          value = "true"
          effect = "NoSchedule"
        }]
      }
      hubble = {
        relay = {
          enabled = true
          rollOutPods = true
          tolerations = [{
            key      = "niovial.com/workload"
            operator = "Equal"
            value    = "observability"
            effect   = "NoSchedule"
          }]
        }
      }
      gatewayAPI = { enabled = true }
      eni = { enabled = true }
      ipam = { mode = "eni" }
      egressMasqueradeInterfaces = "eth0"
      routingMode = "native"
      kubeProxyReplacement = "true"
      k8sServiceHost = replace(module.eks.cluster_endpoint, "https://", "")
      k8sServicePort = "443"
    })
  ]
}

module "eks_managed_node_group" {
  source = "terraform-aws-modules/eks/aws//modules/eks-managed-node-group"
  version = "21.18.0"

  name = "system-nodes"
  cluster_name = module.eks.cluster_name
  cluster_service_cidr = module.eks.cluster_service_cidr
  cluster_endpoint = module.eks.cluster_endpoint
  cluster_auth_base64 = module.eks.cluster_certificate_authority_data

  subnet_ids = module.vpc.private_subnets

  cluster_primary_security_group_id = module.eks.cluster_primary_security_group_id
  vpc_security_group_ids = [module.eks.node_security_group_id]
  
  iam_role_additional_policies = {
    cilium_eni = data.aws_iam_policy.cni_policy.arn
    worker_node = data.aws_iam_policy.worker_node_policy.arn
    image_pull_only = data.aws_iam_policy.ecr_pull_only_policy.arn
  }

  min_size = 1
  desired_size = 2
  max_size = 3

  instance_types = ["t4g.medium"]
  ami_type = "AL2023_ARM_64_STANDARD"
  capacity_type = "SPOT"

  # CriticalAddonsOnly taint prevents workload pods from scheduling on these nodes.
  # Only pods that explicitly tolerate this taint (Cilium operator, ArgoCD, coredns)
  # will be allowed to run here.
  taints = {
    critical_addons = {
      key    = "CriticalAddonsOnly"
      value  = "true"
      effect = "NO_SCHEDULE"
    },
  }

  labels = {
    "karpenter.sh/controller" = "true"
  }

  update_config = {
    max_unavailable = 1
  }
  # Node group must wait for Cilium manifests to be applied to the API server.
  # When nodes join, the Cilium DaemonSet (which tolerates all taints) schedules
  # immediately, initializes the network, and removes the network-unavailable taint.
  depends_on = [ helm_release.cilium ]
}

resource "aws_eks_addon" "coredns" {
  cluster_name = module.eks.cluster_name
  addon_name = "coredns"
  resolve_conflicts_on_update = "PRESERVE"

  # coredns requires Ready nodes with a functioning CNI to schedule.
  # It is intentionally managed outside the eks module to ensure it is only
  # created after the node group is Ready and Cilium has initialized the network.
  depends_on = [ module.eks_managed_node_group ]
}

resource "helm_release" "argocd" {
  name = "argocd"
  namespace = "argocd"
  create_namespace = true
  repository = "oci://ghcr.io/argoproj/argo-helm"
  chart = "argo-cd"
  version = "9.5.4"
  values = [
    yamlencode({
      global = {
        # CriticalAddonsOnly toleration required because all nodes carry this taint.
        tolerations = [
          {
            key      = "CriticalAddonsOnly"
            operator = "Equal"
            value    = "true"
            effect   = "NoSchedule"
          }
        ]
      }
    })
  ]
  # depends_on coredns ensures the addon is present before ArgoCD pods attempt to schedule.
  depends_on = [ aws_eks_addon.coredns ]
}

module "karpenter" {
  source = "terraform-aws-modules/eks/aws//modules/karpenter"
  version = "21.18.0"

  cluster_name = module.eks.cluster_name
  
  # role nodes need to use to be authorized to join eks cluster
  node_iam_role_name = "KarpenterNodeRole-${module.eks.cluster_name}"
  # refuse prefix auto-append to make reference in karpenter crds easier
  node_iam_role_use_name_prefix = false
  enable_spot_termination = true
  queue_name = "KarpenterInterruptionQueue-${module.eks.cluster_name}"

  depends_on = [ aws_eks_addon.coredns ]
}