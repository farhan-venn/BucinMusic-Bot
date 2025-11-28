const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('pause').setDescription('Jeda lagu'),
  async execute(interaction, client) {
    try {
      const queue = client.player.nodes.get(interaction.guildId);
      if (!queue) return interaction.reply('❌ Tidak ada musik.');
      queue.node.pause();
      interaction.reply('⏸ Musik dijeda.');
    } catch (e) {
      interaction.reply(`❌ Error: ${e.message}`);
    }
  }
};
