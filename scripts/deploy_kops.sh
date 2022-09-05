#!/usr/bin/env bash
export NAME=deejai.${1-teticio.co.uk}
export KOPS_STATE_STORE=s3://clusters.${1-teticio.co.uk}
export AWS_REGION=${2-us-east-1}
export AWS_ACCESS_KEY_ID=$(aws configure get default.aws_access_key_id)
export AWS_SECRET_ACCESS_KEY=$(aws configure get default.aws_secret_access_key)

kops create cluster \
  --zones=${AWS_REGION}a \
  --node-count=2 \
  --node-size="t3.large" \
  ${NAME}
kops update cluster ${NAME} --yes --admin
kops validate cluster ${NAME} --wait 20m

# install ingress-nginx
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm upgrade \
  --install nginx ingress-nginx/ingress-nginx \
  --create-namespace \
  --namespace deejai \
  --version 4.0.1

# install cert-manager
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm upgrade \
  --install cert-manager jetstack/cert-manager \
  --create-namespace \
  --namespace cert-manager \
  --version v1.5.3 \
  --set installCRDs=true
  
# install deejai chart
export $(grep -v '^#' backend/credentials.py | xargs)
helm upgrade \
  --install deejai helm-chart/deejai \
  --create-namespace \
  --namespace deejai \
  --values helm-chart/deejai/values.yaml \
  --set domain=${1-teticio.co.uk} \
  --set url=https://${1-teticio.co.uk} \
  --set spotifyClientId=$SPOTIFY_CLIENT_ID \
  --set spotifyClientSecret=$SPOTIFY_CLIENT_SECRET \
  --set ingress.enabled=true \
  --set letsencrypt.enabled=true \
  --set letsencrypt.email=teticio@gmail.com \
  --set image.pullPolicy=Always \
  --set autoscaling.enabled=true

# install dashboard and metrics-server
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.5/aio/deploy/recommended.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/kops/master/addons/metrics-server/v1.16.x.yaml
kubectl create serviceaccount dashboard -n default
kubectl create clusterrolebinding dashboard-admin -n default --clusterrole=cluster-admin --serviceaccount=default:dashboard
kubectl get secret $(kubectl get serviceaccount dashboard -o jsonpath="{.secrets[0].name}") -o jsonpath="{.data.token}" | base64 --decode
echo
echo "kubectl proxy"
echo "http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/#/login#"

# load tests
# while true; do curl -X 'GET' 'https://teticio.co.uk/api/v1/search?string=a&max_items=100' -H 'accept: application/json'; done
# while true; do curl -X 'GET' 'https://teticio.co.uk/api/v1/search_similar?url=https%3A%2F%2Fp.scdn.co%2Fmp3-preview%2Fb8879c1f8a68d43439c969069590013ec8447abb%3Fcid%3D1a7897e3c69d4684aa4d8e90d5911594&max_items=10'; done

# kops delete cluster --name ${NAME} --yes