## Subir imagen Talos a Hetzner
```bash
docker run --rm -e HCLOUD_TOKEN="<your token>" ghcr.io/apricote/hcloud-upload-image:latest hcloud-upload-image upload \
  --image-url "<URL_TALOS_IMAGE>" \
  --architecture x86 \
  --compression bz2
```
## Inicializar proyecto pulumi 

```bash
pulumi new ts
pulumi config set hcloud:token <TOKEN> --secret
```

## Obtener kubeconfig
```bash
pulumi stack outputs kubeconfig --show-secrets > kubeconfig
```

## Conectarse al cluster
```bash
export KUBECONFIG=kubeconfig
kubectl get nodes
```

## Referencias
[Talos Pulumi](https://www.pulumi.com/registry/packages/talos/)

[Hetzner Pulumi](https://www.pulumi.com/registry/packages/hcloud/)

[Talos Image Repository](https://factory.talos.dev/)

[Hetzner Image upload](https://github.com/apricote/hcloud-upload-image)
