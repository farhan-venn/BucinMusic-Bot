// play.js (Perbaikan)

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
  
  // Ambil objek 'player' langsung dari argumen yang diteruskan index.js
  async execute({ interaction, player }) { 
    const query = interaction.options.getString("query");
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel)
      return interaction.reply("❌ Kamu harus berada di voice channel.");

    await interaction.deferReply();

    try {
      console.log(`[Play] Query: ${query}`);
      
      // Menggunakan objek 'player' secara langsung
      const { track } = await player.play(voiceChannel, query, { 
        requestedBy: interaction.user,
        nodeOptions: {
          metadata: { channel: interaction.channel }, // Metadata harus berupa objek
          leaveOnEmpty: true,
          leaveOnEnd: true,
          leaveOnStop: true
        }
      });

      console.log(`[Play] Now playing: ${track.title}`);
      
      // Cek apakah track berhasil dimuat
      if (!track) {
        return interaction.editReply(`❌ Gagal memuat lagu. Coba lagi.`);
      }

      return interaction.editReply(`🎶 Memutar: **${track.title}**`);
      
    } catch (e) {
      console.error('[Play Error]', e.message);
      // Jika terjadi error (misalnya tidak ada hasil), kirim pesan ini:
      return interaction.editReply(`❌ Error saat memutar lagu: ${e.message}`);
    }
  }
};
