const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('skip').setDescription('Lewati lagu'),
  async execute(interaction, client) {
    try {
      const queue = client.player.nodes.get(interaction.guildId);
      if (!queue || !queue.isPlaying()) return interaction.reply('❌ Tidak ada musik.');
      queue.node.skip();
      interaction.reply('⏭ Lagu dilewati.');
    } catch (e) {
      interaction.reply(`❌ Error: ${e.message}`);
    }
  }
};
