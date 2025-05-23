#!/bin/bash

# Script to initialize the Terraform working directory.
# This command downloads the necessary provider plugins and sets up the backend.

# TODO Any params needed here?
echo "Initializing Terraform..."
cd backend/infrastructure || { echo "Directory backend/terraform not found"; exit 1; }
terraform init

# Check if the initialization was successful
if [ $? -eq 0 ]; then
  echo "Terraform initialization successful."
else
  echo "Terraform initialization failed. Please check the error messages above."
  exit 1
fi
