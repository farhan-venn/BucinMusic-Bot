const { Client, IntentsBitField, Collection, REST, Routes } = require('discord.js');
const { Player } = require('discord-player');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Setup Client
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.MessageContent,
    ],
});

// Collection untuk menyimpan commands
client.commands = new Collection();

// Setup Player (Discord-Player)
const player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        filter: 'audioonly',
        highWaterMark: 1 << 25,
        dlChunkSize: 0,
    },
});

// Fungsi Memuat Extractors
async function loadExtractors() {
    try {
        await player.extractors.loadDefault();
        console.log('[Bot] Extractors loaded successfully!');
    } catch (e) {
        console.error('[Bot] Failed to load extractors:', e);
    }
}

// --- COMMAND HANDLER (Membaca Folder 'commands') ---
const commandsPath = path.join(__dirname, 'commands');
// Membaca file di dalam folder commands (asumsi tidak ada sub-folder kategori)
// Jika Anda punya sub-folder (misal: commands/music/play.js), kabari saya.
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commandsToRegister = [];

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    // Pastikan file command punya properti 'data' dan 'execute'
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commandsToRegister.push(command.data.toJSON());
        console.log(`[Info] Command dimuat: ${command.data.name}`);
    } else {
        console.log(`[Warning] Command di ${filePath} tidak punya properti 'data' atau 'execute'.`);
    }
}
// ---------------------------------------------------

client.on('ready', async () => {
    console.log(`BucinMusic#${client.user ? client.user.username : 'Bot'} online!`);
    await loadExtractors();

    // Mendaftarkan Slash Commands ke Discord API
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    try {
        console.log(`Sedang mendaftarkan ${commandsToRegister.length} commands...`);
        
        // Pastikan Anda menambahkan CLIENT_ID di Variable Railway
        const clientId = process.env.CLIENT_ID || client.user.id; 
        
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commandsToRegister },
        );
        console.log('Berhasil mendaftarkan slash commands!');
    } catch (error) {
        console.error('Gagal mendaftarkan commands:', error);
    }
});

// Interaction Handler (Menjalankan Command)
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`Tidak ada command yang cocok untuk ${interaction.commandName}`);
        return;
    }

    try {
        // Oper 'player' ke dalam execute agar bisa dipakai di file command
        await command.execute({ interaction, client, player });
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'Ada error saat menjalankan command ini!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Ada error saat menjalankan command ini!', ephemeral: true });
        }
    }
});

// Error Handling Player
player.events.on('playerStart', (queue, track) => {
    queue.metadata.channel.send(`🎶 Mulai memutar **${track.title}**!`);
});

player.on('error', (queue, error) => {
    console.log(`[Player Error] ${error.message}`);
});

player.events.on('playerError', (queue, error) => {
    console.log(`[Player Track Error] ${error.message}`);
});

client.login(process.env.TOKEN);
