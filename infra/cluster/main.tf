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
    ResourceType = "Kubernetes"
    ManagedBy    = "OpenTofu"
  }
}