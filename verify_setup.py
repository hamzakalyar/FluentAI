#!/usr/bin/env python3
"""
VERIFICATION SCRIPT
===================
Checks that all dependencies are installed and the system is ready to run.
Run this before starting the services.

Usage:
  python verify_setup.py
  python3 verify_setup.py
"""

import subprocess
import sys
import os
from pathlib import Path

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

def print_success(msg):
    print(f"{Colors.GREEN}✅ {msg}{Colors.RESET}")

def print_error(msg):
    print(f"{Colors.RED}❌ {msg}{Colors.RESET}")

def print_warning(msg):
    print(f"{Colors.YELLOW}⚠️  {msg}{Colors.RESET}")

def print_info(msg):
    print(f"{Colors.BLUE}ℹ️  {msg}{Colors.RESET}")

def check_command(cmd, name=None):
    """Check if a command is available in PATH"""
    try:
        subprocess.run([cmd, "--version"], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def check_node_modules(path, name):
    """Check if npm packages are installed"""
    node_modules = Path(path) / "node_modules"
    package_json = Path(path) / "package.json"
    
    if not package_json.exists():
        print_error(f"package.json not found in {name}")
        return False
    
    if not node_modules.exists():
        print_warning(f"node_modules not found in {name} — run 'npm install'")
        return False
    
    return True

def check_python_packages():
    """Check if required Python packages are installed"""
    required = [
        'flask', 'flask_cors', 'openai', 'librosa', 'spacy', 
        'nltk', 'textblob', 'pydub', 'numpy', 'soundfile'
    ]
    
    missing = []
    for package in required:
        try:
            __import__(package.replace('_', '-'))
        except ImportError:
            missing.append(package)
    
    return missing

def main():
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BLUE}  AI-Based Speech Fluency Monitoring System{Colors.RESET}")
    print(f"{Colors.BLUE}  Pre-flight Verification{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}\n")
    
    all_good = True
    
    # ===== SYSTEM REQUIREMENTS =====
    print(f"{Colors.BLUE}[1/4] System Requirements{Colors.RESET}")
    print("-" * 60)
    
    if check_command("node", "Node.js"):
        result = subprocess.run(["node", "--version"], capture_output=True, text=True)
        print_success(f"Node.js installed: {result.stdout.strip()}")
    else:
        print_error("Node.js not found — install from https://nodejs.org")
        all_good = False
    
    if check_command("npm", "npm"):
        result = subprocess.run(["npm", "--version"], capture_output=True, text=True)
        print_success(f"npm installed: {result.stdout.strip()}")
    else:
        print_error("npm not found")
        all_good = False
    
    if check_command("python3", "Python3") or check_command("python", "Python"):
        result = subprocess.run(["python3" if check_command("python3") else "python", "--version"], capture_output=True, text=True)
        print_success(f"Python installed: {result.stdout.strip()}")
    else:
        print_error("Python not found — install from https://www.python.org")
        all_good = False
    
    print()
    
    # ===== NODE PACKAGES =====
    print(f"{Colors.BLUE}[2/4] Backend Dependencies (Node.js){Colors.RESET}")
    print("-" * 60)
    
    if check_node_modules("server", "Backend"):
        print_success("Backend node_modules found")
    else:
        print_warning("Backend: run 'cd server && npm install'")
        all_good = False
    
    if check_node_modules("client", "Frontend"):
        print_success("Frontend node_modules found")
    else:
        print_warning("Frontend: run 'cd client && npm install'")
        all_good = False
    
    print()
    
    # ===== PYTHON PACKAGES =====
    print(f"{Colors.BLUE}[3/4] Python Dependencies{Colors.RESET}")
    print("-" * 60)
    
    missing = check_python_packages()
    if not missing:
        print_success("All Python packages installed")
    else:
        print_warning(f"Missing Python packages: {', '.join(missing)}")
        print_info("Install with: cd audio-service && pip install -r requirements.txt")
        all_good = False
    
    print()
    
    # ===== ENVIRONMENT FILES =====
    print(f"{Colors.BLUE}[4/4] Configuration Files{Colors.RESET}")
    print("-" * 60)
    
    env_file = Path("server/.env")
    if env_file.exists():
        print_success("Backend .env file found")
    else:
        print_warning("Backend .env not found")
        print_info("Create 'server/.env' using the template in 'server/.env.example'")
        all_good = False
    
    print()
    
    # ===== SUMMARY =====
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}")
    if all_good:
        print_success("All systems ready! You can now run START_ALL.bat (Windows) or start_all.sh (Linux/Mac)")
    else:
        print_error("Some issues need to be resolved before starting services")
        print_warning("Fix the above issues and run this script again")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}\n")
    
    return 0 if all_good else 1

if __name__ == "__main__":
    sys.exit(main())
