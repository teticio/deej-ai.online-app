help: ## show help message
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  \033[36m\033[0m\n"} /^[$$()% a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

install: ## install dependencies locally
	./install.sh

run: ## run locally
	tmux new-session -d -s "deejai" ./run.sh

test: ## run tests locally
	./run_tests.sh

download: ## download model artifacts
	pipenv run python download.py

docker: ## build docker file
	./build_docker.sh

k8s: ## install helm chart on kubernetes
	./install_helm_chart.sh
