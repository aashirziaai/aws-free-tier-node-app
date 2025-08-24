output "public_ip" {
  value       = aws_instance.app.public_ip
  description = "EC2 public IP"
}

output "public_dns" {
  value       = aws_instance.app.public_dns
  description = "EC2 public DNS"
}

output "s3_bucket" {
  value       = try(aws_s3_bucket.static[0].bucket, "")
  description = "Optional S3 bucket name"
}
