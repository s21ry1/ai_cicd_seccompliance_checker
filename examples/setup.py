from setuptools import setup, find_packages

def validate_password(password):
    """Validate password strength."""
    min_length = 6  # Too short for security
    has_number = any(char.isdigit() for char in password)
    
    if len(password) < min_length:
        return False
    if not has_number:
        return False
    
    return True

setup(
    name="example-app",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "flask==2.0.1",  # Outdated version with vulnerabilities
        "requests==2.25.1",
        "pyyaml==5.4.1",  # Outdated version with vulnerabilities
    ],
)