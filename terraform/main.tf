data "aws_region" "current" {}

resource "aws_ecs_cluster" "deejai" {
  name = "deejai"

  tags = {
    Name = var.tag
  }
}

resource "aws_cloudwatch_log_group" "deejai" {
  name = "/ecs/deejai"

  tags = {
    Name = var.tag
  }
}

resource "aws_ecs_service" "deejai" {
  name            = "deejai"
  task_definition = aws_ecs_task_definition.deejai.arn
  cluster         = aws_ecs_cluster.deejai.id
  launch_type     = "FARGATE"
  desired_count   = 1

  load_balancer {
    target_group_arn = aws_lb_target_group.deejai.arn
    container_name   = "deejai"
    container_port   = "8000"
  }

  network_configuration {
    assign_public_ip = false
    subnets          = aws_subnet.private.*.id

    security_groups = [
      aws_security_group.egress_all.id,
      aws_security_group.ingress_api.id,
    ]
  }

  tags = {
    Name = var.tag
  }
}

resource "aws_ecs_task_definition" "deejai" {
  family = "deejai"

  container_definitions = <<EOF
[{
  "name": "deejai",
  "image": "teticio/deejai:latest",
  "environment": [
    {
      "name": "APP_URL",
      "value": "https://${var.domain}"
    },
    {
      "name": "REACT_APP_API_URL",
      "value": "https://${var.domain}/api/v1"
    },
    {
      "name": "SPOTIFY_REDIRECT_URI",
      "value": "https://${var.domain}/api/v1/callback"
    },
    {
      "name": "NO_CACHE",
      "value": "1"
    }
  ],
  "portMappings": [{
    "containerPort": 8000
  }],
  "logConfiguration": {
    "logDriver": "awslogs",
    "options": {
      "awslogs-region": "${data.aws_region.current.name}",
      "awslogs-group": "/ecs/deejai",
      "awslogs-stream-prefix": "ecs"
    }
  }
}]
  EOF

  execution_role_arn       = aws_iam_role.deejai_task_execution_role.arn
  cpu                      = 1024
  memory                   = 2048
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"

  tags = {
    Name = var.tag
  }
}

resource "aws_iam_role" "deejai_task_execution_role" {
  name               = "deejai-task-execution-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json

  tags = {
    Name = var.tag
  }
}

data "aws_iam_policy_document" "ecs_task_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

data "aws_iam_policy" "ecs_task_execution_role" {
  arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role" {
  role       = aws_iam_role.deejai_task_execution_role.name
  policy_arn = data.aws_iam_policy.ecs_task_execution_role.arn
}

resource "aws_lb_target_group" "deejai" {
  name        = "deejai"
  port        = 8000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.app_vpc.id

  health_check {
    enabled             = true
    path                = "/healthz"
    timeout             = 20
    unhealthy_threshold = 10
  }

  depends_on = [aws_alb.deejai]

  tags = {
    Name = var.tag
  }
}

resource "aws_alb" "deejai" {
  name               = "deejai"
  internal           = false
  load_balancer_type = "application"
  subnets            = aws_subnet.public.*.id

  security_groups = [
    aws_security_group.http.id,
    aws_security_group.https.id,
    aws_security_group.egress_all.id,
  ]

  depends_on = [aws_internet_gateway.igw]

  tags = {
    Name = var.tag
  }
}

resource "aws_alb_listener" "http" {
  load_balancer_arn = aws_alb.deejai.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }

  tags = {
    Name = var.tag
  }
}

data "aws_route53_zone" "deejai" {
  name         = var.hosted_zone
  private_zone = false
}

resource "aws_acm_certificate" "deejai" {
  domain_name       = var.domain
  validation_method = "DNS"

  tags = {
    Name = var.tag
  }
}

resource "aws_route53_record" "deejai" {
  for_each = {
    for dvo in aws_acm_certificate.deejai.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.deejai.zone_id
}

resource "aws_acm_certificate_validation" "deejai" {
  certificate_arn         = aws_acm_certificate.deejai.arn
  validation_record_fqdns = [for record in aws_route53_record.deejai : record.fqdn]
}

resource "aws_alb_listener" "https" {
  load_balancer_arn = aws_alb.deejai.arn
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn   = aws_acm_certificate_validation.deejai.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.deejai.arn
  }

  tags = {
    Name = var.tag
  }
}

resource "aws_route53_record" "www" {
  zone_id         = data.aws_route53_zone.deejai.zone_id
  name            = var.domain
  type            = "A"
  allow_overwrite = true

  alias {
    evaluate_target_health = true
    name                   = aws_alb.deejai.dns_name
    zone_id                = aws_alb.deejai.zone_id
  }
}
