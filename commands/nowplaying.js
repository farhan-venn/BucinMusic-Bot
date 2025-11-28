const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('nowplaying').setDescription('Lagu yang diputar'),
  async execute(interaction, client) {
    try {
      const queue = client.player.nodes.get(interaction.guildId);
      if (!queue || !queue.currentTrack) return interaction.reply('❌ Tidak ada musik.');
      const title = queue.currentTrack.title || 'Unknown Track';
      interaction.reply(`🎶 **${title}**`);
    } catch (e) {
      interaction.reply(`❌ Error: ${e.message}`);
    }
  }
};
