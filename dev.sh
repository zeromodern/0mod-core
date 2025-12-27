#!/bin/bash
# Serve the apps directory
cd "$(dirname "$0")"
echo "Serving 0mod apps at http://localhost:8000"
python3 -m http.server 8000
