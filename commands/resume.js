const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('resume').setDescription('Lanjutkan lagu'),
  async execute(interaction, client) {
    try {
      const queue = client.player.nodes.get(interaction.guildId);
      if (!queue) return interaction.reply('❌ Tidak ada musik.');
      queue.node.resume();
      interaction.reply('▶ Musik dilanjutkan.');
    } catch (e) {
      interaction.reply(`❌ Error: ${e.message}`);
    }
  }
};
