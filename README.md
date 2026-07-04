YOUTUBE : https://www.youtube.com/watch?v=_itqpLVS660

# Backend Advance AI Fullstack
🐳 Docker
1. Introduction

Docker is a containerization platform that packages an application along with its dependencies into a container, ensuring it runs consistently across different environments.

Commands
docker --version
docker info
2. Images & Containers
Docker Image

A Docker image is a read-only template containing the application, libraries, dependencies, and configuration required to run an application.

Docker Container

A Docker container is a running instance of a Docker image.

Commands
# Download an image
docker pull ubuntu

# List images
docker images

# Create and run a container
docker run -it ubuntu

# List running containers
docker ps

# List all containers
docker ps -a

# Start a stopped container
docker start <container_id>

# Stop a container
docker stop <container_id>

# Remove a container
docker rm <container_id>

# Remove an image
docker rmi <image_name>
3. How to Dockerize a Node.js Application
Step 1: Create a Dockerfile
FROM node

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
Step 2: Build the Image
docker build -t my-node-app .
Step 3: Run the Container
docker run -it my-node-app
4. Port Mapping

Port mapping allows access to a containerized application from the host machine.

Syntax
docker run -p HOST_PORT:CONTAINER_PORT image_name
Example
docker run -p 3000:3000 my-node-app

Check running containers:

docker ps

Stop container:

docker stop <container_id>
5. Docker Compose

Docker Compose is used to manage multiple containers using a single YAML configuration file.

Start all services
docker compose up
Build and start
docker compose up --build
Run in background
docker compose up -d
Stop services
docker compose down
View running services
docker compose ps
6. Docker Networking

Docker networking enables communication between containers.

List networks
docker network ls
Create a network
docker network create my-network
Connect a container
docker network connect my-network my-container
Inspect a network
docker network inspect my-network
Remove a network
docker network rm my-network
7. Docker Volumes

Docker volumes are used to persist data even after a container is removed.

Create a volume
docker volume create my-volume
List volumes
docker volume ls
Run a container with a volume
docker run -v my-volume:/app/data my-node-app
Inspect a volume
docker volume inspect my-volume
Remove a volume
docker volume rm my-volume
Common Docker Commands
# Build Image
docker build -t app-name .

# Run Container
docker run -it app-name

# Run with Port Mapping
docker run -p 3000:3000 app-name

# Run in Background
docker run -d app-name

# Run with Container Name
docker run --name backend app-name

# View Images
docker images

# View Containers
docker ps

# View All Containers
docker ps -a

# Stop Container
docker stop <container_id>

# Start Container
docker start <container_id>

# Remove Container
docker rm <container_id>

# Remove Image
docker rmi <image_name>

# View Logs
docker logs <container_id>

# Execute Commands Inside Container
docker exec -it <container_id> bash

Docker Network Types

Docker provides different network drivers to control how containers communicate with each other and with the host machine.

1. Bridge Network (Default)

A Bridge network is the default network created by Docker. Containers connected to the same bridge network can communicate with each other using their container names.

Use Case: Communication between multiple containers on the same Docker host.

2. Host Network

In Host networking, the container shares the host machine's network. No separate IP address is assigned to the container.

Use Case: Applications requiring maximum network performance.

3. None Network

The container has no network connectivity.

Use Case: Security testing or completely isolated containers.

4. Overlay Network

Overlay networks allow containers running on different Docker hosts to communicate. It is mainly used with Docker Swarm.

Use Case: Multi-host container communication.

📁 Bind Mount

A Bind Mount links a folder from the host machine to a folder inside the Docker container, allowing real-time file synchronization during development.

💾 Named Volume

A Named Volume is Docker-managed storage that persists data even if the container is stopped or deleted. It is commonly used for databases and persistent application data.