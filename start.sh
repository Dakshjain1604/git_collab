#!/bin/bash

# Resume Analyzer - Complete Application Startup Script
# This script starts all services: MongoDB, AI Backend, Backend API, and Frontend

set -e  # Exit on any error

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
    echo -e "${BLUE}[START]${NC} $1"
}

# Check if we're in the right directory
if [ ! -d "AI_backend" ] || [ ! -d "Backend" ] || [ ! -d "Fe" ]; then
    print_error "Please run this script from the git_collab directory"
    exit 1
fi

print_header "Resume Analyzer Startup Script"
echo "Starting all services: MongoDB, AI Backend, Backend API, and Frontend"
echo

# Check for required environment variables
if [ -f "AI_backend/.env" ]; then
    print_status "Loading environment variables from AI_backend/.env..."
    # Export variables from .env file (handling both KEY=VALUE and export KEY=VALUE)
    set -a
    source AI_backend/.env
    set +a
fi

if [ -z "$OPENAI_API_KEY" ]; then
    print_warning "OPENAI_API_KEY environment variable not set"
    print_warning "Please set it with: export OPENAI_API_KEY=your_key_here"
    echo
fi

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local service_name=$1
    local port=$2
    local max_attempts=30
    local attempt=1

    print_status "Waiting for $service_name to be ready on port $port..."

    while [ $attempt -le $max_attempts ]; do
        if check_port $port; then
            print_status "$service_name is ready!"
            return 0
        fi

        echo -n "."
        sleep 2
        ((attempt++))
    done

    print_error "$service_name failed to start within 60 seconds"
    return 1
}

# Function to start MongoDB
start_mongodb() {
    print_header "Starting MongoDB..."

    # Check if MongoDB is already running
    if pgrep -x "mongod" > /dev/null; then
        print_status "MongoDB is already running"
        return 0
    fi

    # Try to start MongoDB using brew services
    if command -v brew >/dev/null 2>&1; then
        print_status "Starting MongoDB with brew services..."
        brew services start mongodb-community 2>/dev/null || {
            print_warning "Failed to start MongoDB with brew services"
            print_warning "Please start MongoDB manually: brew services start mongodb-community"
        }
    else
        print_warning "Homebrew not found. Please start MongoDB manually."
    fi

    # Wait a moment for MongoDB to start
    sleep 3
}

# Function to start AI Backend
start_ai_backend() {
    print_header "Starting AI Backend (FastAPI)..."

    cd AI_backend

    # Check if virtual environment exists and activate it
    if [ -d ".venv" ]; then
        print_status "Activating virtual environment..."
        source .venv/bin/activate 2>/dev/null || print_warning "Failed to activate venv"
    fi

    # Check if dependencies are installed
    if ! .venv/bin/python -c "import fastapi" 2>/dev/null; then
        print_warning "Python dependencies not found. Installing..."
        uv sync --quiet || {
            print_error "Failed to install Python dependencies"
            cd ..
            return 1
        }
    fi

    # Start AI Backend in background
    print_status "Starting AI Backend on port 8000..."
    nohup .venv/bin/python main.py > ../logs/ai_backend.log 2>&1 &
    echo $! > ../.ai_backend_pid

    cd ..
    wait_for_service "AI Backend" 8000
}

# Function to start Backend API
start_backend() {
    print_header "Starting Backend API (Express.js)..."

    cd Backend

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_warning "Node.js dependencies not found. Installing..."
        npm install --silent || {
            print_error "Failed to install Node.js dependencies"
            cd ..
            return 1
        }
    fi

    # Start Backend in background
    print_status "Starting Backend API on port 3000..."
    nohup npm run dev > ../logs/backend.log 2>&1 &
    echo $! > ../.backend_pid

    cd ..
    wait_for_service "Backend API" 3000
}

# Function to start Frontend
start_frontend() {
    print_header "Starting Frontend (React/Vite)..."

    cd Fe

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_warning "Frontend dependencies not found. Installing..."
        npm install --silent || {
            print_error "Failed to install frontend dependencies"
            cd ..
            return 1
        }
    fi

    # Start Frontend in background
    print_status "Starting Frontend on port 5173..."
    nohup npm run dev -- --host > ../logs/frontend.log 2>&1 &
    echo $! > ../.frontend_pid

    cd ..
    wait_for_service "Frontend" 5173
}

# Function to cleanup on exit
cleanup() {
    print_header "Shutting down services..."

    # Kill processes if PID files exist
    if [ -f ".ai_backend_pid" ]; then
        kill $(cat .ai_backend_pid) 2>/dev/null || true
        rm -f .ai_backend_pid
    fi

    if [ -f ".backend_pid" ]; then
        kill $(cat .backend_pid) 2>/dev/null || true
        rm -f .backend_pid
    fi

    if [ -f ".frontend_pid" ]; then
        kill $(cat .frontend_pid) 2>/dev/null || true
        rm -f .frontend_pid
    fi

    print_status "All services stopped"
    exit 0
}

# Function to show status
show_status() {
    echo
    print_header "Service Status"
    echo "AI Backend (FastAPI):    $(check_port 8000 && echo -e "${GREEN}Running${NC} on http://localhost:8000" || echo -e "${RED}Not running${NC}")"
    echo "Backend API (Express):  $(check_port 3000 && echo -e "${GREEN}Running${NC} on http://localhost:3000" || echo -e "${RED}Not running${NC}")"
    echo "Frontend (React):       $(check_port 5173 && echo -e "${GREEN}Running${NC} on http://localhost:5173" || echo -e "${RED}Not running${NC}")"
    echo "MongoDB:                $(pgrep -x "mongod" > /dev/null && echo -e "${GREEN}Running${NC}" || echo -e "${RED}Not running${NC}")"
    echo
    print_status "To stop all services, press Ctrl+C"
}

# Set up trap for cleanup
trap cleanup SIGINT SIGTERM

# Create logs directory
mkdir -p logs

# Start all services
start_mongodb
start_ai_backend
start_backend
start_frontend

# Show final status
show_status

# Keep the script running
print_status "All services started successfully!"
print_status "Press Ctrl+C to stop all services"

# Wait indefinitely
while true; do
    sleep 1
done
