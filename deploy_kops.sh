export NAME=deejai.teticio.co.uk
export KOPS_STATE_STORE=s3://clusters.teticio.co.uk
kops create cluster \
    --zones=us-east-1a \
    --node-count=1 \
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
  --set autoscaling.enabled=false
# install dashboard
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.5/aio/deploy/recommended.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/kops/master/addons/metrics-server/v1.16.x.yaml
kubectl create serviceaccount dashboard -n default
kubectl create clusterrolebinding dashboard-admin -n default --clusterrole=cluster-admin --serviceaccount=default:dashboard
kubectl get secret $(kubectl get serviceaccount dashboard -o jsonpath="{.secrets[0].name}") -o jsonpath="{.data.token}" | base64 --decode
echo "kubectl proxy"
echo "http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/#/login#"
# kops delete cluster --name ${NAME} --yes
