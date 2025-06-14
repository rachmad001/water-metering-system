# Use a stable base image
FROM ubuntu:22.04

# Avoid interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Set an argument for the Docker group ID, which we'll get from the host
ARG DOCKER_GID

# Install dependencies and essential tools
RUN apt-get update && apt-get install -y \
    curl \
    sudo \
    git \
    python3 \
    python3-pip \
    nodejs \
    npm \
    php \
    gnupg \
    lsb-release \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install the Docker CLI (not the full engine)
RUN install -m 0755 -d /etc/apt/keyrings
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
RUN chmod a+r /etc/apt/keyrings/docker.gpg
RUN echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null
RUN apt-get update && apt-get install -y docker-ce-cli

# Create a non-root user 'coder' with UID 1000
RUN useradd -m -s /bin/bash -u 1000 coder

# Add coder to sudo group
RUN usermod -aG sudo coder
# Remove password requirement for sudo
RUN echo 'coder ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Add coder to the docker group with the host's GID
# This is crucial for Docker-out-of-Docker to work
RUN if [ -z "$DOCKER_GID" ]; then DOCKER_GID=999; fi && \
    groupadd -g $DOCKER_GID docker || groupmod -g $DOCKER_GID docker && \
    usermod -aG docker coder

# Switch to the coder user
USER coder
WORKDIR /home/coder

# Install code-server
RUN curl -fsSL https://code-server.dev/install.sh | sh

# Expose the code-server port
EXPOSE 8080

# Start code-server allowing access from any host
# The project directory will be the default folder opened
CMD ["code-server", "--bind-addr", "0.0.0.0:8080", "/home/coder/project"]