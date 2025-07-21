# AI-Powered CI/CD Security Compliance Checker - Usage Guide

## Table of Contents

- [Installation and Setup](#installation-and-setup)
- [Basic Usage](#basic-usage)
- [Use Cases](#use-cases)
  - [DevSecOps Integration](#devsecops-integration)
  - [Pre-commit Scanning](#pre-commit-scanning)
  - [Continuous Integration](#continuous-integration)
  - [Compliance Validation](#compliance-validation)
  - [Security Audits](#security-audits)
- [Advanced Usage](#advanced-usage)
  - [CI/CD Integration](#cicd-integration)
  - [Custom Scanning](#custom-scanning)
  - [Offline Environments](#offline-environments)
- [Troubleshooting](#troubleshooting)

## Installation and Setup

### Prerequisites

Before installing the tool, ensure you have:

- Python 3.8 or higher
- Sufficient disk space for the CodeLlama model (~4GB)
- Administrative privileges (for installing Ollama and Trivy)

### Step-by-Step Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/s21ry1/ai_cicd_seccompliance_checker.git
   cd ai_cicd_seccompliance_checker
   ```

2. **Run the installation script**

   ```bash
   ./install.sh
   ```

   Follow the prompts to install Ollama and Trivy if they're not already installed.

3. **Start Ollama and download the CodeLlama model**

   ```bash
   ./start_ollama.sh
   ```

   This will start the Ollama service and ensure the CodeLlama model is available.

## Basic Usage

### Running a Basic Scan

```bash
# Scan a directory
./simple_analyze.py /path/to/directory

# Scan a specific file
./simple_analyze.py /path/to/file.yml

# Specify a custom output file name
./simple_analyze.py /path/to/directory custom_report_name.txt
```

### Understanding Reports

After running a scan, two report files are generated in the `reports` directory:

1. **Text Report** (*.txt): Contains detailed findings in plain text format
2. **HTML Report** (*.html): Provides a visual, interactive report with formatted results

Each report includes:

- **AI Analysis**: Identifies issues based on code semantics and context
- **Trivy Scan Results**: Identifies known issues from security databases

### Viewing Reports

```bash
# View the most recent text report
cat $(ls -t reports/*.txt | head -1)

# Open the most recent HTML report in your default browser
xdg-open $(ls -t reports/*.html | head -1)  # Linux
open $(ls -t reports/*.html | head -1)      # macOS
start $(ls -t reports/*.html | head -1)     # Windows
```

## Use Cases

### DevSecOps Integration

Integrate security scanning into your development workflow:

```bash
# Scan code before committing changes
./simple_analyze.py ./src

# Scan infrastructure as code files
./simple_analyze.py ./infrastructure

# Scan CI/CD configuration files
./simple_analyze.py ./.github/workflows
```

### Pre-commit Scanning

Create a pre-commit hook to scan files before committing:

```bash
# Create a pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Get list of staged files
files=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(yaml|yml|tf|Dockerfile|py|sh)$')

if [ -n "$files" ]; then
  # Create a temporary file with the list of files
  temp_file=$(mktemp)
  echo "$files" > "$temp_file"
  
  # Run the security scanner on these files
  cd $(git rev-parse --show-toplevel)
  ./path/to/ai_cicd_seccompliance_checker/simple_analyze.py $(cat "$temp_file")
  scan_exit_code=$?
  
  rm "$temp_file"
  
  if [ $scan_exit_code -ne 0 ]; then
    echo "Security issues found. Please fix them before committing."
    exit 1
  fi
fi

exit 0
EOF

chmod +x .git/hooks/pre-commit
```

### Continuous Integration

Run security scans as part of your CI pipeline:

```bash
# Example CI script
set -e

# Clone the security scanner
git clone https://github.com/yourusername/ai_cicd_seccompliance_checker.git
cd ai_cicd_seccompliance_checker

# Install dependencies
./install.sh

# Start Ollama
./start_ollama.sh

# Run security scan
./simple_analyze.py /path/to/codebase

# Check for HIGH severity issues
if grep -q "Severity: HIGH" reports/*.txt; then
  echo "HIGH severity issues found. Pipeline failed."
  exit 1
fi
```

### Compliance Validation

Validate infrastructure code against compliance standards:

```bash
# Scan Terraform files for compliance issues
./simple_analyze.py ./terraform

# Scan Kubernetes manifests for security best practices
./simple_analyze.py ./kubernetes

# Generate a compliance report for audit purposes
./simple_analyze.py ./infrastructure compliance_report.txt
```

### Security Audits

Perform comprehensive security audits across your codebase:

```bash
# Full repository scan
./simple_analyze.py /path/to/repository

# Scan specific components
./simple_analyze.py /path/to/repository/backend
./simple_analyze.py /path/to/repository/frontend
./simple_analyze.py /path/to/repository/infrastructure

# Generate a consolidated report
cat reports/*.txt > consolidated_audit_report.txt
```

## Advanced Usage

### CI/CD Integration

#### GitHub Actions

```yaml
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
    
    - name: Install Trivy
      run: |
        curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
    
    - name: Install dependencies
      run: |
        pip install requests rich Jinja2
    
    - name: Run security scan
      run: |
        chmod +x simple_analyze.py
        ./simple_analyze.py . security-report.txt
    
    - name: Upload security report
      uses: actions/upload-artifact@v2
      with:
        name: security-reports
        path: reports/
```

#### GitLab CI

```yaml
stages:
  - security

security_scan:
  stage: security
  image: python:3.9
  script:
    # Install Ollama
    - curl -fsSL https://ollama.com/install.sh | sh
    - ollama serve &
    - sleep 5
    - ollama pull codellama
    
    # Install Trivy
    - curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
    
    # Install security scanner
    - git clone https://github.com/yourusername/ai_cicd_seccompliance_checker.git
    - cd ai_cicd_seccompliance_checker
    - pip install -r requirements.txt
    - chmod +x simple_analyze.py
    
    # Run security scan
    - ./simple_analyze.py /builds/your-project
  artifacts:
    paths:
      - ai_cicd_seccompliance_checker/reports/
```

### Custom Scanning

#### Customizing File Types

Edit the `RELEVANT_EXTENSIONS` list in `simple_analyze.py` to add or remove file types:

```python
RELEVANT_EXTENSIONS = [
    '.py', '.sh', '.yml', '.yaml', '.tf', '.dockerfile', 'Dockerfile',
    '.github/workflows', 'k8s', 'kubernetes', '.json', '.xml', '.toml',
    # Add your custom extensions here
    '.js', '.ts', '.go', '.java'
]
```

#### Customizing AI Prompts

Modify the prompt in the `analyze_file` function to focus on specific security concerns:

```python
prompt = f"""
# Original prompt...

# Add additional instructions
Also focus specifically on:
1. GDPR compliance issues
2. PCI-DSS requirements
3. HIPAA data protection concerns
"""
```

### Offline Environments

For air-gapped or restricted environments:

1. **Pre-download dependencies**

   ```bash
   # On a machine with internet access
   pip download -r requirements.txt -d ./dependencies
   ```

2. **Transfer files**

   Transfer the following to the offline environment:
   - The security scanner repository
   - Downloaded dependencies
   - Ollama binary and CodeLlama model
   - Trivy binary and vulnerability database

3. **Install in offline environment**

   ```bash
   # Install Python dependencies
   pip install --no-index --find-links ./dependencies -r requirements.txt
   
   # Install Ollama and Trivy manually
   # ...
   
   # Run the scanner
   ./simple_analyze.py /path/to/code
   ```

## Troubleshooting

### Common Issues

#### Ollama Connection Error

```
Error: Ollama server is not responding
```

**Solution**: Ensure Ollama is running with `./start_ollama.sh` or manually start it with `ollama serve`.

#### CodeLlama Model Not Found

```
Warning: CodeLlama model not found in Ollama
```

**Solution**: Pull the model manually with `ollama pull codellama`.

#### Trivy Not Installed

```
Warning: Trivy is not installed
```

**Solution**: Install Trivy using the instructions provided or run `./install.sh` again.

#### Permission Denied

```
permission denied: ./simple_analyze.py
```

**Solution**: Make the script executable with `chmod +x simple_analyze.py`.

### Getting Help

If you encounter issues not covered here, please:

1. Check the logs in the terminal output
2. Ensure all dependencies are correctly installed
3. Verify you have sufficient disk space and memory
4. Open an issue on the GitHub repository with detailed information about the problem