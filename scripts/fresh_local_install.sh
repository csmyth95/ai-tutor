#!/bin/bash
set -euxo pipefail

# Install brew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Docker daemon colima
brew install colima

# Setup Docker & docker compose
brew install docker docker-compose

# Configure Docker CLI plugins directory for Homebrew
mkdir -p ~/.docker
if [ -f ~/.docker/config.json ]; then
    # Update existing config using jq or create new if jq not available
    if command -v jq &> /dev/null; then
        jq '. + {"cliPluginsExtraDirs": ["/opt/homebrew/lib/docker/cli-plugins"]}' ~/.docker/config.json > ~/.docker/config.json.tmp && mv ~/.docker/config.json.tmp ~/.docker/config.json
    else
        echo "Warning: jq not installed, manually add cliPluginsExtraDirs to ~/.docker/config.json"
    fi
else
    # Create new config file
    cat > ~/.docker/config.json << 'EOF'
{
    "cliPluginsExtraDirs": [
        "/opt/homebrew/lib/docker/cli-plugins"
    ]
}
EOF
fi

# Setup Go
# https://go.dev/dl/