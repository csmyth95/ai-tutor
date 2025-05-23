#!/bin/bash

# Script to apply the Terraform configuration.
# This command creates or modifies resources in your AWS account according to the plan.

echo "Applying Terraform changes..."
# The -auto-approve flag is used for automation.
# For production environments, it's recommended to remove -auto-approve
# and manually confirm the apply operation.
terraform apply -auto-approve

# Check if the apply operation was successful
if [ $? -eq 0 ]; then
  echo "Terraform apply successful. Resources have been deployed."
else
  echo "Terraform apply failed. Please check the error messages above."
  exit 1
fi
