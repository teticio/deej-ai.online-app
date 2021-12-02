data "aws_availability_zones" "az" {}

resource "aws_vpc" "app_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name = var.tag
  }
}

resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.app_vpc.id
  count             = length(data.aws_availability_zones.az.names)
  cidr_block        = "10.0.${10 + count.index}.0/24"
  availability_zone = data.aws_availability_zones.az.names[count.index]

  tags = {
    Name = var.tag
  }
}

resource "aws_subnet" "private" {
  vpc_id            = aws_vpc.app_vpc.id
  count             = length(data.aws_availability_zones.az.names)
  cidr_block        = "10.0.${20 + count.index}.0/24"
  availability_zone = data.aws_availability_zones.az.names[count.index]

  tags = {
    Name = var.tag
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.app_vpc.id

  tags = {
    Name = var.tag
  }
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.app_vpc.id

  tags = {
    Name = var.tag
  }
}

resource "aws_route_table_association" "public_subnet" {
  count          = length(aws_subnet.private.*.id)
  subnet_id      = element(aws_subnet.public.*.id, count.index)
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "private_subnet" {
  count          = length(aws_subnet.private.*.id)
  subnet_id      = element(aws_subnet.private.*.id, count.index)
  route_table_id = element(aws_route_table.private.*.id, count.index)
}

resource "aws_eip" "nat" {
  count = length(aws_subnet.private.*.id)
  vpc   = true

  tags = {
    Name = var.tag
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.app_vpc.id

  tags = {
    Name = var.tag
  }
}

resource "aws_nat_gateway" "ngw" {
  count         = length(aws_subnet.private.*.id)
  allocation_id = element(aws_eip.nat.*.id, count.index)
  subnet_id     = element(aws_subnet.public.*.id, count.index)

  depends_on = [aws_internet_gateway.igw]

  tags = {
    Name = var.tag
  }
}

resource "aws_route" "public_igw" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw.id
}

resource "aws_route" "private_ngw" {
  count                  = length(aws_route_table.private.*.id)
  route_table_id         = element(aws_route_table.private.*.id, count.index)
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = element(aws_nat_gateway.ngw.*.id, count.index)
}

resource "aws_security_group" "http" {
  name   = "http"
  vpc_id = aws_vpc.app_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "TCP"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = var.tag
  }
}

resource "aws_security_group" "https" {
  name   = "https"
  vpc_id = aws_vpc.app_vpc.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "TCP"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = var.tag
  }
}

resource "aws_security_group" "egress_all" {
  name   = "egress_all"
  vpc_id = aws_vpc.app_vpc.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = var.tag
  }
}

resource "aws_security_group" "ingress_api" {
  name   = "ingress_api"
  vpc_id = aws_vpc.app_vpc.id

  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "TCP"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = var.tag
  }
}

resource "aws_security_group" "efs" {
  name   = "efs"
  vpc_id = aws_vpc.app_vpc.id

  ingress {
    from_port   = 2049
    to_port     = 2049
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = var.tag
  }
}
