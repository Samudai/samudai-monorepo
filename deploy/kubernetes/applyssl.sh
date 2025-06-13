kubectl get svc

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.1/deploy/static/provider/do/deploy.yaml
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.7.1/cert-manager.yaml

kubectl create -f prod_issuer.yaml
kubectl apply -f ingress_nginx_svc.yaml
kubectl apply -f echo_ingress.yaml

kubectl get svc --namespace=ingress-nginx
