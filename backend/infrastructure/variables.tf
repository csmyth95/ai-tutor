# Declare a variable for the AWS region
variable "aws_region" {
  description = "The AWS region to deploy resources in"
  type        = string
  default     = "eu-north-1" # Stockholm
}

variable "env" {
    description = "Environment where the infra is being deployed to"
    type = string
    default = "live"
}

variable "project" {
    description = "Project which the code is deployed for"
    type = string
    default = "muinteoir_ai"
}