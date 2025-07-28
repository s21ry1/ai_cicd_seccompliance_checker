#!/bin/bash

# Colors and styles
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "\n${BLUE}🛑 Shutting Down AI & DevOps Services...${NC}"

# Stop Ollama
echo -e "${YELLOW}→ Stopping Ollama...${NC}"
sudo kill -9 $(pgrep -f "ollama serve") 2>/dev/null && echo -e "${GREEN}✓ Ollama stopped${NC}" || echo -e "${RED}✗ Ollama not running${NC}"

# Stop Trivy
echo -e "${YELLOW}→ Stopping Trivy...${NC}"
sudo kill -9 $(pgrep -f "trivy") 2>/dev/null && echo -e "${GREEN}✓ Trivy stopped${NC}" || echo -e "${RED}✗ Trivy not running${NC}"

# Stop Analyzer
echo -e "${YELLOW}→ Stopping Analyzer (simple_analyze.py)...${NC}"
sudo kill -9 $(pgrep -f "simple_analyze.py") 2>/dev/null && echo -e "${GREEN}✓ Analyzer stopped${NC}" || echo -e "${RED}✗ Analyzer not running${NC}"

sleep 1

# Verify
echo -e "\n${BLUE}🔍 Verifying Status...${NC}"
running=$(ps aux | grep -E 'ollama|trivy|simple_analyze.py' | grep -v grep)

if [ -z "$running" ]; then
  echo -e "${GREEN}✅ All targeted services are successfully stopped.${NC}"
else
  echo -e "${RED}⚠️ Services still running:${NC}\n$running"
fi

# Docker status
echo -e "\n${BLUE}🐳 Docker Containers Running:${NC}"
docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Status}}" || echo -e "${RED}Docker is not running${NC}"

echo -e "\n${GREEN}🎉 Done. All services managed.${NC}\n"
