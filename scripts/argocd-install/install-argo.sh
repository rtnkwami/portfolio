helm install argocd argo/argo-cd \
  --namespace argocd --create-namespace \
  -f "$(dirname "$0")/values.yaml"