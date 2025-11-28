const { Client, IntentsBitField } = require('discord.js');
require('dotenv').config();

// Gunakan require untuk discord-player
const { Player } = require('discord-player');
// Kita tidak perlu ExtractorFactory secara eksplisit jika menggunakan loadDefault
const { BridgeProvider, Type } = require('@discord-player/extractor');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', () => {
    console.log(`BucinMusic#${client.user ? client.user.username : 'Bot'} online!`);
});

const player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        filter: 'audioonly',
        highWaterMark: 1 << 25,
        dlChunkSize: 0,
    },
});

// FUNGSI UTAMA UNTUK MEMUAT EXTRACTOR (CommonJS Style)
// Kita bungkus dalam fungsi async agar aman
async function loadExtractors() {
    try {
        await player.extractors.loadDefault();
        console.log('[Bot] Player initialized with default extractors!');
    } catch (e) {
        console.error('[Bot] Failed to load extractors:', e);
    }
}

// Panggil fungsi load
loadExtractors();

player.on('error', (queue, error) => {
    console.log(`[Player Error] ${error.message}`);
});

player.events.on('playerError', (queue, error) => {
    console.log(`[Player Track Error] ${error.message}`);
});

// Import commands menggunakan require
// PERHATIAN: Pastikan file commands.js Anda menggunakan 'module.exports'
try {
    require('./commands.js');
} catch (e) {
    console.log('[Warning] commands.js mungkin bermasalah atau tidak ditemukan:', e.message);
}

client.login(process.env.TOKEN);
