#!/bin/bash
cd /home/kavia/workspace/code-generation/vanuatu-e-police-cert-app-117850-cbabac92/epc_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

