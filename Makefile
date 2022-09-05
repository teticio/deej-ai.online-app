help: ## show help message
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  \033[36m\033[0m\n"} /^[$$()% a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

install: ## install dependencies locally
	scripts/install.sh

run: ## run locally
	tmux new-session -d -s "deejai" scripts/run.sh

test: ## run tests locally
	scripts/run_tests.sh

download: ## download model artifacts
	pipenv run python scripts/download.py

docker: ## build docker file
	scripts/build_docker.sh

k8s: ## install helm chart on kubernetes
	scripts/install_helm_chart.sh

tf_apply: ## deploy with terraform
	scripts/tf_apply.sh

tf_destroy: ## tear down terraform deployment
	scripts/tf_destroy.sh
