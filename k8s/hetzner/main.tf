module "kubernetes" {
  source = "hcloud-k8s/kubernetes/hcloud"
  version = "~>4.3.0"

  hcloud_token = var.hcloud_token
  cluster_delete_protection = false

  cluster_name = "homelab"
  cluster_talosconfig_path = "talosconfig"
  cluster_kubeconfig_path = "kubeconfig"

  cilium_gateway_api_enabled = true
  cilium_hubble_enabled = true
  cilium_hubble_relay_enabled = true
  cluster_autoscaler_discovery_enabled = true

  cluster_allow_scheduling_on_control_planes = false
  
  control_plane_nodepools = [
    { name = "control", type = "cx23", location = "hel1", count = 1 }
  ]

  worker_nodepools = [
    { name = "worker", type = "cx33", location = "hel1", count = 3 }
  ]
}

resource "helm_release" "argocd" {
  name = "argocd"
  namespace = "argocd"
  create_namespace = true
  repository = "oci://ghcr.io/argoproj/argo-helm"
  chart = "argo-cd"
  
  depends_on = [ module.kubernetes ]
}