// File: commands/play.js

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Putar musik dari YouTube")
    .addStringOption(opt =>
      opt
        .setName("query")
        .setDescription("Judul lagu atau URL")
        .setRequired(true)
    ),

  // PERBAIKAN 1: HANYA ambil 'interaction' dan 'client' dari index.js
  async execute({ interaction, client }) {
    // PERBAIKAN 2: Ambil player dari client yang sudah ditempelkan
    const player = client.player; 

    // Cek keamanan jika player tetap undefined (meski seharusnya tidak)
    if (!player) {
      return interaction.reply("❌ Error: Player internal bot gagal diinisialisasi.");
    }
    
    const query = interaction.options.getString("query");
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel)
      return interaction.reply("❌ Kamu harus berada di voice channel.");

    await interaction.deferReply();

    try {
      // Baris ini (sekitar baris 19-32 di file Anda) akan berhasil
      const { track } = await player.play(voiceChannel, query, { 
        requestedBy: interaction.user,
        nodeOptions: {
          metadata: { channel: interaction.channel },
          leaveOnEmpty: true,
          leaveOnEnd: true,
          leaveOnStop: true
        }
      });

      if (!track) {
        return interaction.editReply(`❌ Gagal memuat lagu. Coba lagi.`);
      }

      return interaction.editReply(`🎶 Memutar: **${track.title}**`);
      
    } catch (e) {
      console.error('[Play Error]', e.message);
      return interaction.editReply(`❌ Error saat memutar lagu: ${e.message}`);
    }
  }
};
