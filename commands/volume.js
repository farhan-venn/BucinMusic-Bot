const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Atur volume (0-100)')
    .addIntegerOption(opt => opt.setName('level').setDescription('0-100').setRequired(true)),
  async execute(interaction, client) {
    const level = interaction.options.getInteger('level');
    const queue = client.player.nodes.get(interaction.guildId);
    if (!queue) return interaction.reply('Tidak ada musik.');
    
    if (level < 0 || level > 100) {
      return interaction.reply('Volume harus antara 0-100.');
    }

    try {
      queue.node.setVolume(level);
      return interaction.reply(`🔊 Volume diset ke ${level}%`);
    } catch (err) {
      console.error(err);
      return interaction.reply('Gagal mengatur volume.');
    }
  }
};