resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name        = "${var.project}-vpc"
    Project     = var.project
    ManagedBy   = "terraform"
    Environment = "dev"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name        = "${var.project}-igw"
    Project     = var.project
    ManagedBy   = "terraform"
    Environment = "dev"
  }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.aws_region}a"
  tags = {
    Name        = "${var.project}-public-subnet"
    Project     = var.project
    ManagedBy   = "terraform"
    Environment = "dev"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name        = "${var.project}-public-rt"
    Project     = var.project
    ManagedBy   = "terraform"
    Environment = "dev"
  }
}

resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "web_sg" {
  name        = "${var.project}-sg"
  description = "Allow HTTP and SSH"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project}-sg"
    Project     = var.project
    ManagedBy   = "terraform"
    Environment = "dev"
  }
}

data "aws_ami" "ubuntu_2204" {
  owners      = ["099720109477"]
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_key_pair" "main" {
  key_name   = "${var.project}-key"
  public_key = file(var.public_key_path)
  tags = {
    Name        = "${var.project}-key"
    Project     = var.project
    ManagedBy   = "terraform"
    Environment = "dev"
  }
}

resource "aws_instance" "app" {
  ami                         = data.aws_ami.ubuntu_2204.id
  instance_type               = "t2.micro"
  key_name                    = aws_key_pair.main.key_name
  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.web_sg.id]
  associate_public_ip_address = true

  metadata_options {
    http_tokens                 = "required"
    http_put_response_hop_limit = 2
  }

  root_block_device {
    volume_type           = "gp3"
    volume_size           = 8
    encrypted             = true
    delete_on_termination = true
  }

  # Load cloud-init from file (Windows-safe; no heredoc)
  user_data = file("${path.module}/cloud-init.yaml")

  tags = {
    Name        = "${var.project}-ec2"
    Project     = var.project
    ManagedBy   = "terraform"
    Environment = "dev"
  }
}

resource "random_id" "suffix" {
  byte_length = 2
}

resource "aws_s3_bucket" "static" {
  count  = var.create_s3 ? 1 : 0
  bucket = "${var.project}-${random_id.suffix.hex}"
  tags = {
    Name        = "${var.project}-static"
    Project     = var.project
    ManagedBy   = "terraform"
    Environment = "dev"
  }
}

resource "aws_s3_bucket_versioning" "static" {
  count  = var.create_s3 ? 1 : 0
  bucket = aws_s3_bucket.static[0].id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "static" {
  count  = var.create_s3 ? 1 : 0
  bucket = aws_s3_bucket.static[0].id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "static" {
  count                   = var.create_s3 ? 1 : 0
  bucket                  = aws_s3_bucket.static[0].id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
