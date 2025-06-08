# Variables
DOCKER_USERNAME ?= registry.digitalocean.com/docr-simple
APP_NAME ?= img
VERSION ?= lang
DOCKER_IMAGE := $(DOCKER_USERNAME)/$(APP_NAME):$(VERSION)

HELM_RELEASE := langapi
HELM_CHART_PATH := ./helmchart/lang-api/.
NAMESPACE := langapi

KUBE_CONTEXT := default

APIV2TAG := apiv2.28

demo: 
	docker compose up --build  && docker compose rm 
# Build the Docker image
build-be:
	docker build -t $(DOCKER_IMAGE)api ./api/.
	docker build -t $(DOCKER_IMAGE)$(APIV2TAG) ./apiv2/.

# Push the Docker image to the repository
push-be:
	docker push $(DOCKER_IMAGE)api
	docker push $(DOCKER_IMAGE)$(APIV2TAG)

build-fe:
	cd pwa 
	npm run build

deploy-fe:
	cd pwa 
	npm run deploy

dev-fe:
	cd pwa
	npm run dev

# Build and push the Docker image
release: deploy-fe build-be push-be

lint: 
	helm lint $(HELM_CHART_PATH)

# Deploy the Helm chart to Kubernetes
deploy:
	helm upgrade --install $(HELM_RELEASE) $(HELM_CHART_PATH) \
		--set image.repository=$(DOCKER_USERNAME)/$(APP_NAME) \
		--set image.tag=$(VERSION)api\
		--set apiv2.image.tag=$(VERSION)$(APIV2TAG) \
		--namespace $(NAMESPACE) \
		--kube-context $(KUBE_CONTEXT)

undeploy:
	helm uninstall $(HELM_RELEASE) \
		--namespace $(NAMESPACE) \
		--kube-context $(KUBE_CONTEXT)
