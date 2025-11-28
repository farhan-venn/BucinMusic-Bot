module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return interaction.reply({ content: 'Command tidak ditemukan', ephemeral: true });
    try {
      await command.execute(interaction, client);
    } catch (err) {
      console.error(err);
      if (interaction.deferred || interaction.replied) {
        interaction.editReply('Terjadi error saat menjalankan command.');
      } else {
        interaction.reply('Terjadi error saat menjalankan command.');
      }
    }
  }
};