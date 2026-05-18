terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~>6.0"
    }
    
    hcloud = {
      source = "hetznercloud/hcloud"
      version = "~>1.0"
    }

    helm = {
      source = "hashicorp/helm"
      version = "~>3.0"
    }
  }

  backend "s3" {
    bucket       = "niovial-portfolio-tf-state"
    key          = "hcloud-k8s-state"
    encrypt      = true
    region       = var.deployment_region
    use_lockfile = true
  }
}