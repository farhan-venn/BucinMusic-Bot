// index.js (Gunakan require untuk paket-paket CommonJS)
// Kita tetap bisa menggunakan import untuk modul dasar JS
import { Client, IntentsBitField } from 'discord.js';
import 'dotenv/config';

// GUNAKAN REQUIRE UNTUK PAKET EXTERNAL DISCORD-PLAYER
const { Player } = require('discord-player');
const { ExtractorFactory } = require('@discord-player/extractor');

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

// Memuat Extractor Factory
ExtractorFactory.load(player);
console.log('[Bot] Player initialized with extractors');

// Tangani event error
player.on('error', (queue, error) => {
    console.log(`[Player Error] ${error.message}`);
});

player.events.on('playerError', (queue, error) => {
    console.log(`[Player Track Error] ${error.message}`);
});

// Import commands (ini mungkin perlu require juga jika isinya CommonJS)
require('./commands.js'); // Ganti import menjadi require

client.login(process.env.TOKEN);
