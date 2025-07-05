# Makefile for Liar Bar App
PROJECT_NAME := liarbar-app
IMAGE_NAME := liarbar-app

.PHONY: help install dev build docker-build docker-run docker-stop clean

help: ## Show this help message
	@echo "Usage: make [target]"
	@echo
	@echo "install        Install dependencies"
	@echo "dev            Start development server"
	@echo "build          Build production assets"
	@echo "docker-build   Build Docker image"
	@echo "docker-run     Run Docker container"
	@echo "docker-stop    Stop and remove Docker container"
	@echo "clean          Clean build artifacts and node_modules"

install: ## Install dependencies
	npm ci

dev: ## Start development server
	npm run dev

build: ## Build production assets
	npm run build

docker-build: ## Build Docker image
	docker build -t $(IMAGE_NAME) .

docker-run: ## Run Docker container in detached mode on port 80
	docker run -d -p 3000:80 --name $(IMAGE_NAME) $(IMAGE_NAME)

docker-stop: ## Stop and remove Docker container
	docker stop $(IMAGE_NAME) || true
	docker rm $(IMAGE_NAME) || true

clean: ## Remove node_modules and build artifacts
	rm -rf node_modules dist 