data "aws_availability_zones" "available_azs" {
  state = "available"
}

data "aws_iam_policy" "cni_policy" {
  name = "AmazonEKS_CNI_Policy"
}

data "aws_iam_policy" "worker_node_policy" {
  name = "AmazonEKSWorkerNodePolicy"
}

data "aws_iam_policy" "ecr_pull_only_policy" {
  name = "AmazonEC2ContainerRegistryPullOnly"
}

locals {
  azs = slice(data.aws_availability_zones.available_azs.names, 0, 3)
}

