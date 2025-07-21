FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    API_KEY=sk-1234567890abcdef

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Run as non-root user (security best practice)
RUN useradd -m appuser
USER appuser

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "app.py"]