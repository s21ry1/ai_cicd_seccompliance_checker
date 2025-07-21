#!/bin/bash

echo "Installing AI-Powered CI/CD Security Compliance Checker..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is required but not installed. Please install Python 3 and try again."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "pip3 is required but not installed. Please install pip3 and try again."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
pip3 install -r requirements.txt

# Make scripts executable
echo "Making scripts executable..."
chmod +x simple_analyze.py start_ollama.sh

# Create reports directory
echo "Creating reports directory..."
mkdir -p "$(dirname "$0")/reports"

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "Ollama is not installed. Would you like to install it? (y/n)"
    read -r install_ollama
    if [[ $install_ollama == "y" ]]; then
        echo "Installing Ollama..."
        curl -fsSL https://ollama.com/install.sh | sh
    else
        echo "Please install Ollama manually: https://ollama.com/download"
    fi
fi

# Check if Trivy is installed
if ! command -v trivy &> /dev/null; then
    echo "Trivy is not installed. Would you like to install it? (y/n)"
    read -r install_trivy
    if [[ $install_trivy == "y" ]]; then
        echo "Installing Trivy..."
        curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
    else
        echo "Please install Trivy manually: https://aquasecurity.github.io/trivy/latest/getting-started/installation/"
    fi
fi

# Reports are now automatically cleaned up before each scan
echo "Reports will be automatically cleaned up before each new scan."

echo "Installation complete!"
echo "To start using the tool, run:"
echo "  1. ./start_ollama.sh"
echo "  2. ./simple_analyze.py ./examples"
echo ""
echo "Reports will be saved to the 'reports' directory."
echo "Previous reports will be automatically deleted when starting a new scan."