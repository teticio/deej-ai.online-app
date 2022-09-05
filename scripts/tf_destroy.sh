#!/usr/bin/env bash
export $(grep -v '^#' backend/credentials.py | awk '$0="TF_VAR_"$0' | xargs)
cd terraform
terraform apply --destroy --auto-approve
cd -
