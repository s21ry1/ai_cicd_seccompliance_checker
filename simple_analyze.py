#!/usr/bin/env python3
"""
AI-Powered CI/CD Security Compliance Checker

This script analyzes DevOps files for security vulnerabilities and compliance issues
using CodeLlama via Ollama.
"""

import os
import sys
import requests
import json
import time
import datetime
import subprocess
from pathlib import Path
from rich.console import Console
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn
from jinja2 import Environment, FileSystemLoader

console = Console()

# File types to analyze
RELEVANT_EXTENSIONS = [
    '.py', '.sh', '.yml', '.yaml', '.tf', '.dockerfile', 'Dockerfile',
    '.github/workflows', 'k8s', 'kubernetes', '.json', '.xml', '.toml'
]

def analyze_file(file_path):
    """Analyze a file using Ollama's CodeLlama model."""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
            
        # Limit content size
        if len(content) > 10000:
            content = content[:10000] + "... [truncated]"
            
        # Determine file type
        file_type = determine_file_type(file_path)
            
        # Create prompt
        prompt = f"""
        You are a security expert analyzing a {file_type} file for security issues.
        
        File: {file_path}
        
        Content:
        ```
        {content}
        ```
        
        Analyze this file for security vulnerabilities, misconfigurations, and compliance issues.
        Focus on:
        1. Hardcoded secrets or credentials
        2. Insecure configurations
        3. Missing security controls
        4. Compliance violations
        5. Best practice violations
        
        Provide specific recommendations for fixing any issues found.
        If no issues are found, briefly explain why the file follows security best practices.
        """
        
        # Call Ollama API
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "codellama",
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "max_tokens": 1024
                }
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            return result.get("response", "").strip()
        else:
            return f"Error: Ollama API returned status {response.status_code}"
            
    except Exception as e:
        return f"Error analyzing file: {str(e)}"

def determine_file_type(file_path):
    """Determine the type of file based on its path and extension."""
    path_str = str(file_path).lower()
    
    if 'dockerfile' in path_str or path_str.endswith('dockerfile'):
        return 'Dockerfile'
    elif '.github/workflows' in path_str:
        return 'GitHub Actions workflow'
    elif '.yml' in path_str or '.yaml' in path_str:
        if 'kubernetes' in path_str or 'k8s' in path_str:
            return 'Kubernetes manifest'
        else:
            return 'YAML configuration'
    elif '.tf' in path_str:
        return 'Terraform'
    elif '.py' in path_str:
        return 'Python'
    elif '.sh' in path_str:
        return 'Shell script'
    elif '.json' in path_str:
        return 'JSON configuration'
    elif '.xml' in path_str:
        return 'XML configuration'
    elif '.toml' in path_str:
        return 'TOML configuration'
    else:
        return 'configuration'

def run_trivy_scan(file_path, output_prefix):
    """Run Trivy scan on a file or directory."""
    try:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        trivy_script = os.path.join(script_dir, "trivy_scan.sh")
        
        # Run Trivy scan
        trivy_output = f"{output_prefix}_trivy"
        result = subprocess.run(
            [trivy_script, str(file_path), trivy_output], 
            capture_output=True, 
            text=True,
            check=False
        )
        
        # Check if scan was successful
        if result.returncode != 0:
            return {"error": result.stderr}
        
        # Read Trivy results
        if os.path.exists(f"{trivy_output}.json"):
            with open(f"{trivy_output}.json", 'r') as f:
                return json.load(f)
        return {"info": "No vulnerabilities found"}
    except Exception as e:
        return {"error": str(e)}

def generate_html_report(results, analysis_path, output_file):
    """Generate an HTML report from the analysis results."""
    try:
        # Get the directory of the current script
        script_dir = os.path.dirname(os.path.abspath(__file__))
        # Set up Jinja2 environment
        env = Environment(loader=FileSystemLoader(os.path.join(script_dir, 'templates')))
        template = env.get_template('report_template.html')
        
        # Add file_type to each result
        for result in results:
            result['file_type'] = determine_file_type(result['file'])
        
        # Generate HTML
        html_content = template.render(
            results=results,
            analysis_path=analysis_path,
            timestamp=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )
        
        # Write HTML to file
        html_file = output_file.replace('.txt', '.html')
        with open(html_file, 'w') as f:
            f.write(html_content)
            
        return html_file
    except Exception as e:
        return f"Error generating HTML report: {str(e)}"

def check_ollama():
    """Check if Ollama is running and CodeLlama model is available."""
    try:
        response = requests.get("http://localhost:11434/api/tags")
        if response.status_code != 200:
            console.print("[bold red]Error:[/bold red] Ollama server is not responding")
            console.print("Please start Ollama with: ./start_ollama.sh")
            return False
            
        # Check if codellama model is available
        models = response.json().get("models", [])
        model_names = [model.get("name") for model in models]
        if "codellama" not in model_names and "codellama:latest" not in model_names:
            console.print("[bold yellow]Warning:[/bold yellow] CodeLlama model not found in Ollama.")
            console.print("Please pull the model with: ollama pull codellama")
            return False
            
        return True
    except Exception as e:
        console.print(f"[bold red]Error:[/bold red] {str(e)}")
        console.print("Please start Ollama with: ./start_ollama.sh")
        return False

def check_trivy():
    """Check if Trivy is installed."""
    try:
        result = subprocess.run(["trivy", "--version"], capture_output=True, text=True)
        if result.returncode != 0:
            console.print("\n[bold yellow]Warning:[/bold yellow] Trivy is not installed or not working properly.")
            console.print("Vulnerability and misconfiguration scanning will be skipped.")
            console.print("To enable Trivy scanning, install Trivy and run this script again.")
            console.print("Installation instructions: https://aquasecurity.github.io/trivy/latest/getting-started/installation/")
            console.print("You can also run ./install.sh which will offer to install Trivy.\n")
            return False
        console.print("[bold green]Trivy detected:[/bold green] Will perform vulnerability and misconfiguration scanning.")
        return True
    except FileNotFoundError:
        console.print("\n[bold yellow]Warning:[/bold yellow] Trivy is not installed.")
        console.print("Vulnerability and misconfiguration scanning will be skipped.")
        console.print("To enable Trivy scanning, install Trivy and run this script again.")
        console.print("Installation instructions: https://aquasecurity.github.io/trivy/latest/getting-started/installation/")
        console.print("You can also run ./install.sh which will offer to install Trivy.\n")
        return False
    except Exception as e:
        console.print(f"\n[bold yellow]Warning:[/bold yellow] Trivy check failed: {str(e)}")
        console.print("Vulnerability and misconfiguration scanning will be skipped.\n")
        return False

def find_files_to_analyze(path):
    """Find files to analyze in the given path."""
    files_to_analyze = []
    path_obj = Path(path)
    
    if path_obj.is_file():
        files_to_analyze.append(path_obj)
    else:
        for root, _, files in os.walk(path):
            for file in files:
                file_path = Path(root) / file
                if any(ext in str(file_path) for ext in RELEVANT_EXTENSIONS):
                    files_to_analyze.append(file_path)
    
    return files_to_analyze

def main():
    """Main function."""
    # Display welcome message
    console.print(Panel.fit(
        "[bold blue]AI-Powered CI/CD Security Compliance Checker[/bold blue]\n"
        "Analyzing files for security vulnerabilities and compliance issues",
        border_style="blue"
    ))
    
    if len(sys.argv) < 2:
        console.print("[bold red]Error:[/bold red] Please provide a path to analyze")
        console.print("Usage: ./simple_analyze.py <path> [output_file]")
        return 1
    
    path = sys.argv[1]
    
    # Create reports directory if it doesn't exist
    reports_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "reports")
    os.makedirs(reports_dir, exist_ok=True)
    
    # Delete previous reports
    console.print("[bold yellow]Deleting previous reports...[/bold yellow]")
    for file in os.listdir(reports_dir):
        file_path = os.path.join(reports_dir, file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception as e:
            console.print(f"[bold red]Error:[/bold red] {e}")
    console.print("[bold green]Previous reports deleted.[/bold green]\n")
    
    # Generate default output filename with timestamp if not provided
    if len(sys.argv) > 2:
        output_file = sys.argv[2]
    else:
        timestamp = time.strftime("%Y%m%d-%H%M%S")
        output_file = os.path.join(reports_dir, f"security_report_{timestamp}.txt")
    
    if not os.path.exists(path):
        console.print(f"[bold red]Error:[/bold red] Path {path} does not exist")
        return 1
    
    # Check if Ollama is running
    if not check_ollama():
        return 1
    
    # Check if Trivy is installed
    trivy_available = check_trivy()
    
    # Offer to install Trivy if not available
    if not trivy_available:
        console.print("Would you like to install Trivy now? (y/n)")
        choice = input().strip().lower()
        if choice == 'y':
            console.print("Installing Trivy...")
            try:
                # Run the installation script
                install_cmd = "curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin"
                subprocess.run(install_cmd, shell=True, check=True)
                console.print("[bold green]Trivy installed successfully![/bold green]")
                trivy_available = True
            except Exception as e:
                console.print(f"[bold red]Error installing Trivy:[/bold red] {str(e)}")
                console.print("Continuing without Trivy scanning.")
        else:
            console.print("Continuing without Trivy scanning.")
    
    console.print("")  # Empty line for better readability
    
    # Find files to analyze
    files_to_analyze = find_files_to_analyze(path)
    
    if not files_to_analyze:
        console.print(f"[bold yellow]Warning:[/bold yellow] No relevant files found in {path}")
        return 0
    
    # Limit to 10 files to avoid overwhelming
    max_files = 10
    if len(files_to_analyze) > max_files:
        console.print(f"[bold yellow]Warning:[/bold yellow] Found {len(files_to_analyze)} files, limiting analysis to first {max_files}")
        files_to_analyze = files_to_analyze[:max_files]
    
    console.print(f"[bold]Found {len(files_to_analyze)} files to analyze[/bold]")
    
    results = []
    
    # Analyze each file
    with Progress(
        SpinnerColumn(),
        TextColumn("[bold green]Analyzing files..."),
        console=console
    ) as progress:
        # Set total steps (AI analysis + Trivy if available)
        total_steps = len(files_to_analyze) * (2 if trivy_available else 1)
        task = progress.add_task("Analyzing", total=total_steps)
        
        for file_path in files_to_analyze:
            # AI analysis
            progress.update(task, description=f"[bold green]AI Analysis: {file_path}")
            analysis = analyze_file(file_path)
            progress.update(task, advance=1)
            
            # Trivy scan if available
            trivy_results = None
            if trivy_available:
                progress.update(task, description=f"[bold green]Trivy Scan: {file_path}")
                trivy_output_prefix = os.path.join(reports_dir, f"trivy_{Path(file_path).name}_{time.strftime('%Y%m%d-%H%M%S')}")
                trivy_results = run_trivy_scan(file_path, trivy_output_prefix)
            progress.update(task, advance=1)
            
            results.append({
                "file": str(file_path),
                "analysis": analysis,
                "trivy_results": trivy_results
            })

    
    # Print analysis
    for result in results:
        console.print(f"\n[bold]Results for {result['file']}:[/bold]")
        console.print(result['analysis'])
        console.print("\n" + "-" * 80 + "\n")
    
    # Always save reports
    if not output_file:
        # Generate default output filename with timestamp
        timestamp = time.strftime("%Y%m%d-%H%M%S")
        output_file = os.path.join(reports_dir, f"security_report_{timestamp}.txt")
    
    # Save text report
    with open(output_file, 'w') as f:
        for result in results:
            f.write(f"File: {result['file']}\n\n")
            
            # AI Analysis
            f.write("=== AI ANALYSIS ===\n")
            f.write("Checks for: Hardcoded secrets, insecure configurations, missing security controls,\n")
            f.write("compliance violations, and best practice issues based on code semantics and context.\n\n")
            f.write(result['analysis'])
            f.write("\n\n")
            
            # Trivy Results
            f.write("=== TRIVY SCAN RESULTS ===\n")
            f.write("Checks for: Known vulnerabilities (CVEs) in dependencies, specific misconfigurations\n")
            f.write("against security benchmarks, and compliance with standard security rules.\n\n")
            if 'trivy_results' in result and result['trivy_results']:
                if 'error' in result['trivy_results']:
                    f.write(f"Error running Trivy: {result['trivy_results']['error']}\n")
                elif 'Results' in result['trivy_results']:
                    has_findings = False
                    for res in result['trivy_results']['Results']:
                        # Vulnerabilities
                        if 'Vulnerabilities' in res and res['Vulnerabilities']:
                            has_findings = True
                            f.write("VULNERABILITIES:\n")
                            for vuln in res['Vulnerabilities']:
                                f.write(f"  ID: {vuln.get('VulnerabilityID', 'N/A')}\n")
                                f.write(f"  Severity: {vuln.get('Severity', 'N/A')}\n")
                                f.write(f"  Package: {vuln.get('PkgName', 'N/A')}\n")
                                f.write(f"  Description: {vuln.get('Description', 'N/A')}\n")
                                f.write("  ---\n")
                        
                        # Misconfigurations
                        if 'Misconfigurations' in res and res['Misconfigurations']:
                            has_findings = True
                            f.write("MISCONFIGURATIONS:\n")
                            for misconf in res['Misconfigurations']:
                                f.write(f"  ID: {misconf.get('ID', 'N/A')}\n")
                                f.write(f"  Severity: {misconf.get('Severity', 'N/A')}\n")
                                f.write(f"  Type: {misconf.get('Type', 'N/A')}\n")
                                f.write(f"  Description: {misconf.get('Description', 'N/A')}\n")
                                f.write("  ---\n")
                    
                    if not has_findings:
                        f.write("No vulnerabilities or misconfigurations found by Trivy.\n")
                else:
                    f.write("No vulnerabilities or misconfigurations found by Trivy.\n")
            else:
                f.write("Trivy scan was not performed. Install Trivy for vulnerability and misconfiguration scanning.\n")
            
            f.write("\n" + "=" * 80 + "\n\n")
    console.print(f"[bold green]Text report saved to:[/bold green] {output_file}")
    
    # Generate and save HTML report
    html_file = generate_html_report(results, path, output_file)
    console.print(f"[bold green]HTML report saved to:[/bold green] {html_file}")
    
    # Summary
    console.print(f"\n[bold]Summary:[/bold]")
    console.print(f"Total files analyzed: {len(results)}")
    if trivy_available:
        console.print("[green]✓[/green] AI-powered analysis completed")
        console.print("[green]✓[/green] Trivy vulnerability and misconfiguration scanning completed")
    else:
        console.print("[green]✓[/green] AI-powered analysis completed")
        console.print("[yellow]⚠[/yellow] Trivy scanning was skipped (Trivy not installed)")
    console.print("Review the reports for security vulnerabilities and compliance issues.")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())