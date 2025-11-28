// index.js (Solusi Campuran Import/Require Paling Stabil)
import { Client, IntentsBitField } from 'discord.js';
import 'dotenv/config';

// 1. Impor createRequire dari modul bawaan Node.js
import { createRequire } from 'module'; 
const require = createRequire(import.meta.url); // 2. Buat fungsi require()

// 3. GUNAKAN REQUIRE YANG BARU DIBUAT untuk paket-paket CommonJS
const { Player } = require('discord-player');
const { ExtractorFactory } = require('@discord-player/extractor');
// ----------------------------------------


const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', () => {
    // Kita menggunakan client.user.username karena discriminator dihapus di Discord.js v14
    console.log(`BucinMusic#${client.user.username} online!`);
});

const player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        filter: 'audioonly',
        highWaterMark: 1 << 25,
        dlChunkSize: 0,
    },
});

// Memuat Extractor Factory (Baris ini yang menyebabkan error)
ExtractorFactory.load(player);
console.log('[Bot] Player initialized with extractors');

// Tangani event error
player.on('error', (queue, error) => {
    console.log(`[Player Error] ${error.message}`);
});

player.events.on('playerError', (queue, error) => {
    console.log(`[Player Track Error] ${error.message}`);
});

// Gunakan require() untuk commands (sesuai dengan fungsi require yang kita buat)
require('./commands.js'); 

client.login(process.env.TOKEN);
