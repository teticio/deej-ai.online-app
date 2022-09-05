variable "region" {
  type    = string
  default = "eu-west-2"
}

variable "tag" {
  type    = string
  default = "deejai"
}

variable "hosted_zone" {
  type    = string
  default = "teticio.co.uk"
}

variable "domain" {
  type    = string
  default = "deejai.teticio.co.uk"
}

variable "SPOTIFY_CLIENT_ID" {
  type = string
}

variable "SPOTIFY_CLIENT_SECRET" {
  type = string
}
