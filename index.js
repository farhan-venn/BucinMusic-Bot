// index.js (Pastikan kode Anda sudah dimodifikasi seperti ini)
import { Client, IntentsBitField } from 'discord.js';
import 'dotenv/config';
import { Player, ExtractorFactory } from 'discord-player'; // Tambahkan ExtractorFactory

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', () => {
    console.log(`BucinMusic#${client.user.discriminator} online!`);
});

const player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        filter: 'audioonly',
        highWaterMark: 1 << 25,
        dlChunkSize: 0,
    },
});

// WAJIB DITAMBAHKAN/VERIFIKASI: Memuat semua extractor yang terinstal
player.extractors.loadDefault();
console.log('[Bot] Player initialized with extractors');

// Tangani event error (disarankan)
player.on('error', (queue, error) => {
    console.log(`[Player Error] ${error.message}`);
});

// Tangani event track error (disarankan)
player.events.on('playerError', (queue, error) => {
    console.log(`[Player Track Error] ${error.message}`);
});

// Import commands (asumsi file ini mengimpor semua commands)
import('./commands.js'); // Ganti dengan cara Anda memuat commands

client.login(process.env.TOKEN);
