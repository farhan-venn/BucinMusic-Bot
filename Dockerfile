# Gunakan image Node.js LTS 18 yang stabil
FROM node:18-alpine 

# Set direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json (jika ada) ke dalam container
COPY package*.json ./

# Instal semua dependensi
# --force diperlukan untuk mengatasi beberapa isu dependency graph lama
RUN npm install --omit=dev --force

# Salin sisa kode aplikasi
COPY . .

# Beri hak akses eksekusi ke start.sh (jika Anda membuatnya di langkah sebelumnya)
# Jika tidak, hapus baris ini, tapi jika Anda membuat start.sh, biarkan
RUN chmod +x start.sh 

# Tentukan command untuk menjalankan bot (sesuai skrip start di package.json)
CMD ["npm", "start"]
