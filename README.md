# MuinteoirAI
My AI tutor web application for learning.

For anyone not used to Irish, Muinteoir is the Irish/Gaeilge for Teacher.

## Architecture
See `Core Tech Stack` section of my [Medium article](https://medium.com/@conorSmyth13/building-my-own-ai-personal-learning-assistant-7bbe74915b3e)

## Proposed repo structure
```plaintext
📦 ai-learning-assistant/
├── 📁 frontend/            # Next.js application
├── 📁 backend/             # Core backend logic and APIs
├── 📁 infrastructure/      # Infrastructure as Code (IaC) setup (e.g., Terraform or CloudFormation)
├── 📁 models/              # Custom Hugging Face model scripts or configuration
├── 📁 scripts/             # Utility scripts for local testing and CI/CD pipelines
├── 📄 .gitignore           # Define files to ignore in Git
├── 📄 README.md            # Project overview and instructions
└── 📄 package.json         # Central package.json (if using a monorepo tool like Turborepo)
```

## Local Backend Setup
### Pre-requisites
* Homebrew - https://brew.sh/
* colima - `brew install colima`
* Go - required for Docker compose - https://go.dev/dl/.
* Docker Compose - use `brew install docker docker-compose` to help  install or Google it.
    * NOTE: For Docker to find the plugin, add "cliPluginsExtraDirs" to ~/.docker/config.json:
    ```json
    "cliPluginsExtraDirs": [
        "/opt/homebrew/lib/docker/cli-plugins"
    ]
    ```
* NodeJS 20.19
* ExpressJS & dependencies
* Postgres - _docker will take care of this_

## Create local.env file
### backend/server
* PORT: Port where ExpressJS server is running.
* DB_NAME: Database name.
* DB_PORT: Port where the database is running.
* DB_USER: Database username for running operations.
* DB_PASSWORD: password to access the database.
* SECRET_KEY: Secret key used for signing JSON Web Tokens (JWT).
* AWS_S3_BUCKET_NAME: Name of S3 bucket where user documents are stored
* AWS_ACCESS_KEY_ID: AWS access key for S3.
* AWS_SECRET_ACCESS_KEY: AWS secret key for S3.
* AWS_REGION: AWS region where the S3 bucket is hosted.

```
# Server Configuration
PORT=<Express server port>

# Database Configuration
DB_NAME=<PostgreSQL database name>
DB_PORT=<PostgreSQL port>
DB_USER=<PostgreSQL username>
DB_PASSWORD=<PostgreSQL password>

# AWS Configuration
AWS_ACCESS_KEY_ID=<AWS access key>
AWS_SECRET_ACCESS_KEY=<AWS secret key>
AWS_REGION=<AWS region>
AWS_S3_BUCKET_NAME=<S3 bucket name>

# Security
SECRET_KEY=<JWT secret key>
```

### database
```
# Database Configuration
DB_NAME=<PostgreSQL database name>
DB_PORT=<PostgreSQL port>
DB_USER=<PostgreSQL username>
DB_PASSWORD=<PostgreSQL password>
```

### frontend
```
NEXT_PUBLIC_POSTHOG_KEY=<POSTHOG_API_KEY>
NEXT_PUBLIC_POSTHOG_HOST=<POSTHOG_HOSTNAME>
```

### Commands
* Deploy latest source changes:  `docker-compose -f local.docker-compose.yml up --build`
* Check Docker logs of a container: `docker logs ai-tutor-backend-1`