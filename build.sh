#!/bin/bash
set -e

# Nettoyer les dossiers générés
rm -rf .nuxt .output

# Installer les dépendances
npm install

# Construire l'application
npm run build

# Préparer Nuxt
npm run postinstall

# Copier le package.json dans le répertoire de sortie
cp package.json .output/ 