#!/bin/bash
set -e

# Installer les dépendances avec npm install (pas ci)
npm install --no-optional

# Préparer et construire
npm run build 