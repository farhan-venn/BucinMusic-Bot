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

  // Pastikan player diterima di sini!
  async execute({ interaction, player }) {
    const query = interaction.options.getString("query");
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel)
      return interaction.reply("❌ Kamu harus berada di voice channel.");

    await interaction.deferReply();

    try {
      // Menggunakan objek 'player' secara langsung
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
