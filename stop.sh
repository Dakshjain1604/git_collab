#!/bin/bash

# Resume Analyzer - Stop All Services Script
# This script stops all running services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[STOP]${NC} $1"
}

print_header "Resume Analyzer - Stopping All Services"

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Stop services by killing processes
stopped_count=0

# Stop AI Backend
if [ -f ".ai_backend_pid" ]; then
    pid=$(cat .ai_backend_pid)
    if kill -0 $pid 2>/dev/null; then
        print_status "Stopping AI Backend (PID: $pid)..."
        kill $pid 2>/dev/null || true
        sleep 2
        if kill -0 $pid 2>/dev/null; then
            print_warning "Force killing AI Backend..."
            kill -9 $pid 2>/dev/null || true
        fi
        print_status "AI Backend stopped"
        stopped_count=$((stopped_count + 1))
    else
        print_warning "AI Backend PID file exists but process not running"
    fi
    rm -f .ai_backend_pid
elif check_port 8000; then
    print_warning "AI Backend running on port 8000 but no PID file found"
    print_warning "Please manually stop the process on port 8000"
else
    print_status "AI Backend not running"
fi

# Stop Backend API
if [ -f ".backend_pid" ]; then
    pid=$(cat .backend_pid)
    if kill -0 $pid 2>/dev/null; then
        print_status "Stopping Backend API (PID: $pid)..."
        kill $pid 2>/dev/null || true
        sleep 2
        if kill -0 $pid 2>/dev/null; then
            print_warning "Force killing Backend API..."
            kill -9 $pid 2>/dev/null || true
        fi
        print_status "Backend API stopped"
        stopped_count=$((stopped_count + 1))
    else
        print_warning "Backend API PID file exists but process not running"
    fi
    rm -f .backend_pid
elif check_port 3000; then
    print_warning "Backend API running on port 3000 but no PID file found"
    print_warning "Please manually stop the process on port 3000"
else
    print_status "Backend API not running"
fi

# Stop Frontend
if [ -f ".frontend_pid" ]; then
    pid=$(cat .frontend_pid)
    if kill -0 $pid 2>/dev/null; then
        print_status "Stopping Frontend (PID: $pid)..."
        kill $pid 2>/dev/null || true
        sleep 2
        if kill -0 $pid 2>/dev/null; then
            print_warning "Force killing Frontend..."
            kill -9 $pid 2>/dev/null || true
        fi
        print_status "Frontend stopped"
        stopped_count=$((stopped_count + 1))
    else
        print_warning "Frontend PID file exists but process not running"
    fi
    rm -f .frontend_pid
elif check_port 5173; then
    print_warning "Frontend running on port 5173 but no PID file found"
    print_warning "Please manually stop the process on port 5173"
else
    print_status "Frontend not running"
fi

# Stop MongoDB
if pgrep -x "mongod" > /dev/null; then
    print_status "Stopping MongoDB..."
    if command -v brew >/dev/null 2>&1; then
        brew services stop mongodb-community 2>/dev/null || {
            print_warning "Failed to stop MongoDB with brew services"
            print_warning "Please stop MongoDB manually: brew services stop mongodb-community"
        }
    else
        print_warning "Homebrew not found. Please stop MongoDB manually."
    fi
    stopped_count=$((stopped_count + 1))
else
    print_status "MongoDB not running"
fi

echo
if [ $stopped_count -gt 0 ]; then
    print_status "Successfully stopped $stopped_count service(s)"
else
    print_status "No services were running"
fi

# Show final status
echo
print_header "Final Service Status"
echo "AI Backend (FastAPI):    $(check_port 8000 && echo -e "${RED}Still running${NC}" || echo -e "${GREEN}Stopped${NC}")"
echo "Backend API (Express):  $(check_port 3000 && echo -e "${RED}Still running${NC}" || echo -e "${GREEN}Stopped${NC}")"
echo "Frontend (React):       $(check_port 5173 && echo -e "${RED}Still running${NC}" || echo -e "${GREEN}Stopped${NC}")"
echo "MongoDB:                $(pgrep -x "mongod" > /dev/null && echo -e "${RED}Still running${NC}" || echo -e "${GREEN}Stopped${NC}")"

echo
print_status "All services have been stopped!"
