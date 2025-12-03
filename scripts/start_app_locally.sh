#!/bin/bash

# Exit on error, print commands, fail on pipe errors
set -euxo pipefail

# Start colima with recommended resources (from README.md)
colima start --cpu 2 --memory 4 --disk 60

# Run docker-compose to build and start all services
docker-compose -f local.docker-compose.yml down -v
docker-compose -f local.docker-compose.yml up --build
