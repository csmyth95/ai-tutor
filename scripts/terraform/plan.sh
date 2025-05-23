#!/bin/bash

# Script to generate a Terraform execution plan.
# This command shows what actions Terraform will take without applying them.

echo "Generating Terraform plan..."
cd backend/infrastructure
terraform plan

# Check if the plan generation was successful
if [ $? -eq 0 ]; then
  echo "Terraform plan generated successfully. Review the proposed changes."
else
  echo "Terraform plan generation failed. Please check the error messages above."
  exit 1
fi
