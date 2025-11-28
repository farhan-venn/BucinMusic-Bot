const { Client, IntentsBitField, Collection, REST, Routes } = require('discord.js');
const { Player } = require('discord-player');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// --- 1. VERIFIKASI PAKET PENTING ---
// Memastikan play-dl dan @discordjs/voice terinstal
try {
    require('@discordjs/voice');
    require('play-dl'); 
} catch (e) {
    console.error(`FATAL ERROR: Paket wajib tidak ditemukan. Pastikan '@discordjs/voice' dan 'play-dl' terinstal. Detail: ${e.message}`);
    process.exit(1);
}
// ----------------------------------

// --- 2. DEKLARASI CLIENT ---
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.MessageContent,
    ],
});
client.commands = new Collection(); 

// --- 3. DEKLARASI PLAYER ---
// Player akan otomatis menggunakan play-dl jika sudah terinstal di package.json
const player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
    }
});
client.player = player; 
// ------------------------------------------

// --- 4. COMMAND HANDLER ---
const commandsPath = path.join(__dirname, 'commands');
const commandsToRegister = [];

function readCommands(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            readCommands(filePath); 
        } else if (file.endsWith('.js')) {
            try {
                const command = require(filePath); 

                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                    commandsToRegister.push(command.data.toJSON());
                    console.log(`[Info] Command dimuat: ${command.data.name}`);
                } else {
                    console.log(`[Warning] Command di ${filePath} tidak punya properti 'data' atau 'execute'.`);
                }
            } catch (e) {
                console.error(`[ERROR] Gagal memuat command di ${filePath}: ${e.message}`);
            }
        }
    }
}
try {
    readCommands(commandsPath);
} catch (e) {
    console.error(`[FATAL] Gagal membaca folder commands: ${e.message}`);
}
// -------------------------------------------------------------------

// --- 5. EVENT HANDLERS ---
client.on('ready', async () => {
    console.log(`BucinMusic#${client.user ? client.user.username : 'Bot'} online!`);

    // Mendaftarkan Slash Commands ke Discord API
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    try {
        console.log(`Sedang mendaftarkan ${commandsToRegister.length} commands...`);
        
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
        await command.execute({ interaction, client }); 
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
    if (queue.metadata && queue.metadata.channel) {
        queue.metadata.channel.send(`🎶 Mulai memutar **${track.title}**!`);
    }
});

player.events.on('error', (queue, error) => {
    console.error(`[Player Error] ${error.message}`);
});

player.events.on('playerError', (queue, error) => {
    console.error(`[Player Track Error] ${error.message}`);
});

// --- 6. START BOT ---
client.login(process.env.TOKEN);
