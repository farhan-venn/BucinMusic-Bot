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

  async execute(interaction, client) {
    const query = interaction.options.getString("query");
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel)
      return interaction.reply("❌ Kamu harus berada di voice channel.");

    await interaction.deferReply();

    try {
      console.log(`[Play] Query: ${query}`);
      
      const queue = await client.player.play(voiceChannel, query, {
        requestedBy: interaction.user,
        nodeOptions: {
          metadata: interaction.channel,
          leaveOnEmpty: true,
          leaveOnEnd: true,
          leaveOnStop: true
        }
      });

      console.log(`[Play] Queue created, waiting for track...`);
      
      // Wait a bit for track to load
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!queue?.currentTrack) {
        console.log('[Play] No current track after wait');
        return interaction.editReply(`❌ Gagal memuat lagu. Coba lagi.`);
      }

      console.log(`[Play] Now playing: ${queue.currentTrack.title}`);
      return interaction.editReply(`🎶 Memutar: **${queue.currentTrack.title}**`);
      
    } catch (e) {
      console.error('[Play Error]', e.message);
      return interaction.editReply(`❌ Error: ${e.message}`);
    }
  }
};
