# Menggunakan Alpine (lebih ringan dan hanya punya sh)
FROM node:18-alpine 

# Instal dependensi yang diperlukan play-dl
RUN apk add --no-cache ffmpeg

# Set direktori kerja
WORKDIR /usr/src/app

# Salin package.json dan instal dependensi
COPY package*.json ./
RUN npm install --omit=dev --force

# Salin sisa kode aplikasi
COPY . .

# Beri hak akses eksekusi ke start.sh
RUN chmod +x start.sh 

# Jalankan bot
CMD ["/bin/sh", "start.sh"]
