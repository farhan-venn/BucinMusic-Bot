# Gunakan image dasar Node.js
FROM node:20-slim 

# Instal FFMPEG dan dependensi build (nasm)
# Ini adalah solusi untuk masalah 'Could not load ffmpeg'
USER root
RUN apt-get update && apt-get install -y \
    ffmpeg \
    nasm \
    && rm -rf /var/lib/apt/lists/*

# Persiapan Lingkungan Aplikasi
WORKDIR /usr/src/app

# Salin dan instal dependensi Node.js
COPY package*.json ./
RUN npm install --production

# Salin sisa kode aplikasi
COPY . .

# Tentukan perintah untuk menjalankan bot
CMD [ "node", "index.js" ]
