# AI-Powered CI/CD Security Compliance Checker 

![Security](https://img.shields.io/badge/Security-Scanning-blue)
![Python](https://img.shields.io/badge/Python-3.8+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

A comprehensive security scanning tool that analyzes DevOps files for vulnerabilities, misconfigurations, and compliance issues using a dual-scanning approach: AI-powered analysis with CodeLlama and vulnerability detection with Trivy.

## 🔍 Features and scope

- **Dual-scanning technology**: AI analysis + vulnerability scanning
- **Comprehensive coverage**: Dockerfiles, CI/CD pipelines, Kubernetes manifests, Terraform, and more
- **AI-powered analysis**: Detects hardcoded secrets, insecure configurations, and best practice violations
- **Vulnerability scanning**: Identifies known CVEs and misconfigurations using Trivy
- **Rich reporting**: Generates detailed reports in both text and visual HTML formats
- **Offline capability**: Works completely offline after initial setup
- **Automatic report management**: Cleans up previous reports when starting a new scan

## 🛠️ Requirements

- Python 3.8+
- Ollama with CodeLlama model
- Trivy (optional but recommended for vulnerability scanning)
- Internet connection only for initial setup

## 📋 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ai_cicd_seccompliance_checker.git
cd ai_cicd_seccompliance_checker
```

### 2. Run the installation script

```bash
./install.sh
```

This script will:
- Install required Python dependencies
- Make scripts executable
- Offer to install Ollama if not already installed
- Offer to install Trivy if not already installed
- Create the reports directory

### 3. Start Ollama and ensure CodeLlama is available

```bash
./start_ollama.sh
```

### 4. Run your first security scan

```bash
./simple_analyze.py ./examples
```

## 📊 Understanding Reports

Reports are saved to the `reports` directory with timestamps and are available in two formats:

- **Text reports** (*.txt): Detailed findings in plain text format
- **HTML reports** (*.html): Visual, interactive reports with formatted results

Each report includes:

1. **AI Analysis**: Identifies issues based on code semantics and context
   - Hardcoded secrets and credentials
   - Insecure configurations
   - Missing security controls
   - Compliance violations
   - Best practice issues

2. **Trivy Scan Results**: Identifies known issues from security databases
   - Known vulnerabilities (CVEs) in dependencies
   - Specific misconfigurations against security benchmarks
   - Compliance with standard security rules

## 🔬 Sample Files

The `examples` directory contains sample files with intentional security issues for testing:

- `Dockerfile`: Contains hardcoded API keys
- `github-workflow.yml`: Contains insecure registry configuration
- `kubernetes-deployment.yaml`: Contains privileged container settings
- `terraform-main.tf`: Contains hardcoded AWS credentials
- `setup.py`: Contains weak password validation

## 📚 Documentation

For detailed usage instructions and advanced configurations, see [USAGE.md](USAGE.md).

## 🔒 Security

This tool is designed for security scanning and should be used responsibly. It helps identify security issues in your code but is not a substitute for a comprehensive security program.

## 📄 License

MIT
