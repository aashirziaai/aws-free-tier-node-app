variable "project" {
  description = "Project name prefix"
  type        = string
  default     = "free-tier-demo"
}

variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "us-east-1"
}

variable "public_key_path" {
  description = "Path to your SSH public key (ed25519)"
  type        = string
  default     = "~/.ssh/aws_free_tier.pub"
}

variable "allowed_ssh_cidr" {
  description = "CIDR allowed to SSH (22)."
  type        = string
  default     = "0.0.0.0/0"
}

variable "create_s3" {
  description = "Create optional S3 bucket (for static/logs)"
  type        = bool
  default     = false
}
