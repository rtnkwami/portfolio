data "aws_availability_zones" "available_azs" {
  state = "available"
}

data "aws_iam_policy" "ssm_access_policy" {
  name = "AmazonSSMManagedInstanceCore"
}

locals {
  azs = slice(data.aws_availability_zones.available_azs.names, 0, 3)
  versions = {
    modules = {
      vpc = "6.6.1"
      eks = "21.18.0"
      pod_identity = "2.8.0"
    }
    helm_releases = {
      argocd = "9.5.14"
    } 
  }
}

