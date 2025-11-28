const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder().setName('leave').setDescription('Suruh bot keluar dari voice channel'),
  async execute(interaction) {
    const conn = getVoiceConnection(interaction.guildId);
    if (!conn) return interaction.reply('Bot tidak bergabung di voice channel manapun.');
    conn.destroy();
    return interaction.reply('🛑 Bot telah meninggalkan voice channel.');
  }
};