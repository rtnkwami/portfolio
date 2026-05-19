terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~>6.0"
    }

    helm = {
      source  = "hashicorp/helm"
      version = "~>3.0"
    }
  }

  backend "s3" {
    bucket       = "niovial-portfolio-tf-state"
    key          = "portfolio-eks-tfstate"
    encrypt      = true
    region       = var.deployment_region
    use_lockfile = true
  }
}