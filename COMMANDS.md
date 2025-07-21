# AI-Powered CI/CD Security Compliance Checker - Commands Reference

This document provides a quick reference for common commands used with the AI-Powered CI/CD Security Compliance Checker.

## Setup Commands

```bash
# Install dependencies and setup
./install.sh

# Start Ollama and ensure CodeLlama is available
./start_ollama.sh
```

## Individual File Scans

```bash
# Scan a Dockerfile
./simple_analyze.py ./examples/Dockerfile

# Scan a Kubernetes manifest
./simple_analyze.py ./examples/kubernetes-deployment.yaml

# Scan a GitHub Actions workflow
./simple_analyze.py ./examples/github-workflow.yml

# Scan a Terraform file
./simple_analyze.py ./examples/terraform-main.tf

# Scan a Python file
./simple_analyze.py ./examples/setup.py

# Specify a custom output file name
./simple_analyze.py ./path/to/file.yml custom_report_name.txt
```

## Directory Scans

```bash
# Scan all files in a directory
./simple_analyze.py ./examples

# Scan a specific project directory
./simple_analyze.py ./path/to/project

# Scan only infrastructure files in a directory
./simple_analyze.py ./path/to/infrastructure

# Scan CI/CD configuration files
./simple_analyze.py ./path/to/project/.github/workflows
```

## GitHub Repository Scans

```bash
# Clone and scan a GitHub repository
git clone https://github.com/username/repository.git
./simple_analyze.py ./repository

# Clone, scan, and save report with repository name
REPO_NAME=repository
git clone https://github.com/username/$REPO_NAME.git
./simple_analyze.py ./$REPO_NAME ${REPO_NAME}_security_report.txt

# Clone a specific branch and scan
git clone -b develop https://github.com/username/repository.git
./simple_analyze.py ./repository

# Clone, scan specific directories in a repository
git clone https://github.com/username/repository.git
./simple_analyze.py ./repository/src
./simple_analyze.py ./repository/infrastructure
```

## Report Management

```bash
# View the most recent text report
cat $(ls -t reports/*.txt | head -1)

# Open the most recent HTML report in your default browser
xdg-open $(ls -t reports/*.html | head -1)  # Linux
open $(ls -t reports/*.html | head -1)      # macOS
start $(ls -t reports/*.html | head -1)     # Windows

# Create a consolidated report from multiple scans
cat reports/*.txt > consolidated_report.txt
```

## CI/CD Integration

```bash
# GitHub Actions workflow example (add to .github/workflows/security-scan.yml)
name: Security Scan

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: '3.9'
    
    - name: Install Ollama
      run: |
        curl -fsSL https://ollama.com/install.sh | sh
        ollama serve &
        sleep 5
    
    - name: Pull CodeLlama model
      run: |
        ollama pull codellama
    
    - name: Install security scanner
      run: |
        git clone https://github.com/yourusername/ai_cicd_seccompliance_checker.git
        cd ai_cicd_seccompliance_checker
        pip install -r requirements.txt
    
    - name: Run security scan
      run: |
        cd ai_cicd_seccompliance_checker
        chmod +x simple_analyze.py
        ./simple_analyze.py .. security-report.txt
    
    - name: Upload security report
      uses: actions/upload-artifact@v2
      with:
        name: security-reports
        path: ai_cicd_seccompliance_checker/reports/
```

## Pre-commit Hook

```bash
# Add as a pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Get list of staged files
files=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(yaml|yml|tf|Dockerfile|py|sh)$')

if [ -n "$files" ]; then
  # Run the security scanner on these files
  cd $(git rev-parse --show-toplevel)
  /path/to/ai_cicd_seccompliance_checker/simple_analyze.py $files pre-commit-scan.txt
  
  if [ $? -ne 0 ]; then
    echo "Security issues found. Please fix them before committing."
    exit 1
  fi
fi

exit 0
EOF

chmod +x .git/hooks/pre-commit
```