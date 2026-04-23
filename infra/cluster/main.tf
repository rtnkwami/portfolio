module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "6.6.1"

  name            = "${var.project_name}-vpc"
  cidr            = var.vpc_cidr
  azs             = local.azs
  private_subnets = [for index, value in local.azs : cidrsubnet(var.vpc_cidr, 4, index)]
  public_subnets  = [for index, value in local.azs : cidrsubnet(var.vpc_cidr, 8, index + 112)]

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

  # CNI pods need nodes to be scheduled to. These are the base nodes. Karpenter handles the rest
  eks_managed_node_groups = {
    system_nodes = {
      ami_type       = "AL2023_ARM_64_STANDARD" # required for graviton instances
      instance_types = ["t4g.medium"]           # cheaper for lab
      capacity_type  = "SPOT"                   # cheaper for lab
      min_size       = 1
      max_size       = 3
      desired_size   = 2

      iam_role_attach_cni_policy            = false
      attach_cluster_primary_security_group = true

      # Prevent any other pods from being scheduled to nodes in this group
      taints = {
        critical_addons = {
          key    = "CriticalAddonsOnly"
          value  = "true"
          effect = "NO_SCHEDULE"
        }
      }

      update_config = {
        max_unavailable = 1
      }

      tags = {
        Name             = "${var.project_name}-eks-system-node-pool"
        Project          = var.project_name
        ResourceCategory = "Compute"
      }
    }
  }

  addons = {
    coredns = {}
    eks-pod-identity-agent = {
      before_compute = true
    }
    kube-proxy = {} # needed for argocd to be deployed before being replaced with cilium
    vpc-cni = {
      before_compute = true
    }
  }

  cluster_tags = {
    Name         = "${var.project_name}-eks-cluster"
    Project      = var.project_name
    ResourceType = "Compute"
    ManagedBy    = "OpenTofu"
  }
}

module "vpc_cni_eks_pod_identity_ipv4" {
  source  = "terraform-aws-modules/eks-pod-identity/aws"
  version = "2.7.0"

  name = "${var.project_name}-eks-vpc-cni-ipv4"

  attach_aws_vpc_cni_policy = true
  aws_vpc_cni_enable_ipv4   = true

  associations = {
    vpc_cni = {
      cluster_name    = module.eks.cluster_name
      namespace       = "kube-system"
      service_account = "aws-node"
    }
  }

  tags = {
    Name         = "${var.project_name}-eks-vpc-cni-addon"
    Project      = var.project_name
    ResourceType = "Compute"
    ManagedBy    = "OpenTofu"
  }
}