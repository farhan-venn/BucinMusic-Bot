const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('stop').setDescription('Hentikan musik'),
  async execute(interaction, client) {
    try {
      const queue = client.player.nodes.get(interaction.guildId);
      if (!queue) return interaction.reply('❌ Tidak ada musik.');
      queue.node.stop();
      interaction.reply('⛔ Musik dihentikan.');
    } catch (e) {
      interaction.reply(`❌ Error: ${e.message}`);
    }
  }
};
