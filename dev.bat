@echo off
cd /d "%~dp0"
echo Serving 0mod apps at http://localhost:8000
python -m http.server 8000
