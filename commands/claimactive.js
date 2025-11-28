const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('claimactive').setDescription('Jalankan command ini untuk memenuhi syarat Active Developer (bot aktif)'),
  async execute(interaction) {
    return interaction.reply('✅ Command diterima — ini akan membantu memenuhi syarat Active Developer. Setelah command ini digunakan, kunjungi https://discord.com/developers/active-developer untuk klaim.');
  }
};