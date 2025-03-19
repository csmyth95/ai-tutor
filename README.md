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
