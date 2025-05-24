# Argocd

## Requerimientos:
- Cluster de kubernetes
    - kubectl
- Instalar ArgoCD
  - Argocd-autopilot
  - docker
  - Token de Git 

## Instalacion
Para instalar Argocd la manera mas sencilla es usando la herramienta `argocd-autopilot`, esta nos permite con un cli instalar Argocd,
crear carpetas iniciales en nuestro repositorio y configurar Argocd como aplicacion para actualizaciones futuras.

[Documentacion Argocd Autopilot](https://argocd-autopilot.readthedocs.io/en/stable/)

Existe otra manera de usar Argocd-autopilot y es con la imagen de Docker.
```bash
docker run \
  -v ~/.kube:/home/autopilot/.kube \
  -v ~/.gitconfig:/home/autopilot/.gitconfig \
  -e GIT_TOKEN= \
  -e GIT_REPO=https://github.com/juanfbl9307/shared-content.git/gitops/argocd/apps-of-apps
  -it quay.io/argoprojlabs/argocd-autopilot argocd-autopilot repo bootstrap
```