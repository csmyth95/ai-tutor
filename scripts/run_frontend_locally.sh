#!/bin/bash

## TODO Create local.env file with the right variables
# Check if local.env file exists
if [ ! -f .env.local ]; then
#   echo "Creating .env.local file..."
#   cp .env.example .env.local
  echo "Please edit the .env.local file with your local environment variables."
  exit 1
fi


# Runs next run command to start the frontend locally
npm run dev
