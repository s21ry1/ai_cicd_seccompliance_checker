#!/bin/bash

# Check if Ollama is running
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "Ollama is already running"
else
    echo "Starting Ollama..."
    ollama serve &
    sleep 5
    echo "Checking if CodeLlama model is available..."
    if ! curl -s http://localhost:11434/api/tags | grep -q "codellama"; then
        echo "Pulling CodeLlama model (this may take a while)..."
        ollama pull codellama
    fi
fi

echo "Ollama is ready to use with CodeLlama"
echo "You can now run the security scanner with AI analysis"