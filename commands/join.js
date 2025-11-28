const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder().setName('join').setDescription('Suruh bot bergabung ke voice channel kamu'),
  async execute(interaction) {
    const vc = interaction.member.voice.channel;
    if (!vc) return interaction.reply('Kamu harus berada di voice channel.');
    joinVoiceChannel({
      channelId: vc.id,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator
    });
    return interaction.reply('✅ Bergabung ke voice channel.');
  }
};