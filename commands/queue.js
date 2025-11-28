const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('queue').setDescription('Tampilkan antrian'),
  async execute(interaction, client) {
    try {
      const queue = client.player.nodes.get(interaction.guildId);
      if (!queue) return interaction.reply('❌ Queue kosong.');
      
      let text = '';
      if (queue.currentTrack) {
        text += `**Sedang diputar:**\n🎵 ${queue.currentTrack.title || 'Unknown'}\n\n`;
      }
      if (queue.tracks.length > 0) {
        text += `**Berikutnya:**\n${queue.tracks.slice(0, 10).map((t, i) => `${i+1}. ${t.title || 'Unknown'}`).join('\n')}`;
      }
      if (!text) text = '❌ Queue kosong.';
      interaction.reply(text);
    } catch (e) {
      interaction.reply(`❌ Error: ${e.message}`);
    }
  }
};
