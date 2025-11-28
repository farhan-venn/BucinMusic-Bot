# 1. Gunakan image dasar Node.js (Pastikan versi sesuai dengan yang Anda gunakan, misal 18 atau 20)
FROM node:20-slim 

# 2. Instal FFMPEG dan dependensi build (nasm)
# FFMPEG diperlukan untuk pemrosesan audio/video.
# NASM diperlukan untuk kompilasi library yang mungkin dibutuhkan FFMPEG.
USER root
RUN apt-get update && apt-get install -y \
    ffmpeg \
    nasm \
    && rm -rf /var/lib/apt/lists/*

# 3. Persiapan Lingkungan Aplikasi
WORKDIR /usr/src/app

# 4. Salin dan instal dependensi Node.js
# Memisahkan COPY package.json dan RUN npm install agar Docker dapat menggunakan cache layer
COPY package*.json ./
RUN npm install --production

# 5. Salin sisa kode aplikasi
COPY . .

# 6. Tentukan perintah untuk menjalankan bot (sesuai dengan script start di package.json Anda)
# Berdasarkan package.json Anda, perintahnya adalah `node .` atau `node index.js`
CMD [ "node", "index.js" ]
