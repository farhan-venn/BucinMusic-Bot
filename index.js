const { Client, IntentsBitField, Collection, REST, Routes } = require('discord.js');
const { Player } = require('discord-player');
// Pastikan paket extractor di-require dengan benar
const { ExtractorFactory } = require('@discord-player/extractor');
const fs = require('fs');
const path = require('path');
const playdl = require('play-dl'); // <-- TAMBAHKAN INI
require('dotenv').config();

// --- 1. VERIFIKASI PAKET PENTING ---
try {
    require('@discordjs/voice');
} catch (e) {
    console.error("FATAL ERROR: Paket '@discordjs/voice' tidak ditemukan. Pastikan sudah diinstal di package.json!");
    process.exit(1);
}
// ----------------------------------

// --- 2. DEKLARASI CLIENT (HARUS PERTAMA) ---
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
const player = new Player(client, {
    // Biarkan ini kosong atau hapus opsi ytdlOptions/extractor
    // Jika Anda ingin tetap ada, pastikan opsi ini diizinkan tanpa ytdl-core/play-dl
});

// BARIS KRUSIAL: Tempelkan objek player ke client
client.player = player; 
// ------------------------------------------

// Fungsi Memuat Extractors
async function loadExtractors() {
    try {
        // PERBAIKAN: Muat Extractor YouTube secara eksplisit
        const { YouTubeExtractor } = require('@discord-player/extractor');

        // Pastikan Anda memanggil loadPlayerExtractors pada player, 
        // dan pastikan Anda memasukkan Extractor YouTube
        await ExtractorFactory.loadPlayerExtractors(player, {
            extractors: [
                YouTubeExtractor 
            ]
        });

        console.log('[Bot] Extractors loaded successfully!');
    } catch (e) {
        console.error('[Bot] Failed to load extractors:', e);
    }
}
// ----------------------------------


// --- 4. COMMAND HANDLER (Membaca Folder 'commands' secara Rekursif) ---
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
    await loadExtractors(); // Muat extractor setelah bot online

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
        // KEMBALIKAN player ke dalam destructuring ARGUMEN, 
        // meskipun kita tahu client.player sudah ditempelkan.
        // Ini memastikan tidak ada error variabel yang hilang.
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

// --- 6. START BOT ---
client.login(process.env.TOKEN);
