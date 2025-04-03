FROM node:20-slim

# Installation des dépendances pour Chromium
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    libatspi2.0-0 \
    libgtk-3-0 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxfixes3 \
    libxi6 \
    libxrender1 \
    libxtst6 \
    libnss3-tools \
    libgdk-pixbuf2.0-0 \
    libxss1 \
    libx11-6 \
    libxext6 \
    libxrandr2 \
    xdg-utils \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Création et configuration du répertoire pour Chromium
RUN mkdir -p /tmp/chromium-pack/lib \
    && chmod -R 777 /tmp/chromium-pack \
    && ln -s /usr/lib/x86_64-linux-gnu/libnss3.so /tmp/chromium-pack/lib/libnss3.so \
    && ln -s /usr/lib/x86_64-linux-gnu/libnspr4.so /tmp/chromium-pack/lib/libnspr4.so

# Configuration des variables d'environnement
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    CHROMIUM_PATH=/tmp/chromium-pack \
    LD_LIBRARY_PATH=/tmp/chromium-pack/lib:/usr/lib/x86_64-linux-gnu \
    FONTCONFIG_PATH=/etc/fonts \
    CHROME_DEVEL_SANDBOX=/tmp/chromium-pack/chrome-sandbox

WORKDIR /app

# Copie des fichiers du projet
COPY . .

# Installation des dépendances
RUN npm install

# Téléchargement et extraction de Chromium
RUN curl -L -o chromium-pack.tar https://devroid.lon1.digitaloceanspaces.com/chromium-pack.tar \
    && tar xf chromium-pack.tar -C /tmp/chromium-pack \
    && rm chromium-pack.tar \
    && curl -L -o swiftshader.tar https://devroid.lon1.digitaloceanspaces.com/swiftshader.tar \
    && tar xf swiftshader.tar -C /tmp/chromium-pack \
    && rm swiftshader.tar \
    && chmod -R 755 /tmp/chromium-pack

# Build de l'application
RUN npm run build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"] 