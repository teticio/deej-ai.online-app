export NAME=deejai.teticio.co.uk
export KOPS_STATE_STORE=s3://clusters.teticio.co.uk
kops create cluster \
    --zones=us-east-1a \
    --node-count=2 \
    --node-size="t3.large" \
    ${NAME}
kops update cluster ${NAME} --yes --admin
kops validate cluster --wait 10m
helm upgrade \
  --install deejai helm-chart/deejai \
  --create-namespace \
  --namespace deejai \
  --values helm-chart/deejai/values.yaml \
  --set service.type=LoadBalancer \
  --set service.port=80 \
  --set image.pullPolicy=Always \
  --set autoscaling.enabled=true
# install dashboard
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.5/aio/deploy/recommended.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/kops/master/addons/metrics-server/v1.16.x.yaml
kubectl create serviceaccount dashboard -n default
kubectl create clusterrolebinding dashboard-admin -n default --clusterrole=cluster-admin --serviceaccount=default:dashboard
kubectl get secret $(kubectl get serviceaccount dashboard -o jsonpath="{.secrets[0].name}") -o jsonpath="{.data.token}" | base64 --decode
echo
echo "kubectl proxy"
echo "http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/#/login#"
# kops delete cluster --name ${NAME} --yes
# while true; do curl -X 'GET' 'http://deejai.teticio.co.uk/api/v1/search?string=a&max_items=100' -H 'accept: application/json'; done
# while true; do curl -X 'GET' 'http://deejai.teticio.co.uk/api/v1/search_similar?url=https%3A%2F%2Fp.scdn.co%2Fmp3-preview%2Fb8879c1f8a68d43439c969069590013ec8447abb%3Fcid%3D1a7897e3c69d4684aa4d8e90d5911594&max_items=10'; done