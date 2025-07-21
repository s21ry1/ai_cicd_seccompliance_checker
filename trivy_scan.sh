#!/bin/bash

# Check if Trivy is installed
if ! command -v trivy &> /dev/null; then
    echo "Trivy is not installed. Please install it first."
    echo "Visit: https://aquasecurity.github.io/trivy/latest/getting-started/installation/"
    exit 1
fi

# Scan file or directory
scan_path="$1"
output_file="$2"

# Determine scan type
if [[ -f "$scan_path" && "$scan_path" == *"Dockerfile"* ]]; then
    # Dockerfile scan
    trivy config --severity HIGH,CRITICAL "$scan_path" -f json -o "${output_file}.json"
elif [[ -f "$scan_path" && "$scan_path" == *.yaml ]] || [[ -f "$scan_path" && "$scan_path" == *.yml ]]; then
    # Kubernetes YAML scan
    trivy config --severity HIGH,CRITICAL "$scan_path" -f json -o "${output_file}.json"
elif [[ -d "$scan_path" ]]; then
    # Directory scan (filesystem)
    trivy fs --security-checks vuln,config --severity HIGH,CRITICAL "$scan_path" -f json -o "${output_file}.json"
else
    # Generic file scan
    trivy config --severity HIGH,CRITICAL "$scan_path" -f json -o "${output_file}.json"
fi