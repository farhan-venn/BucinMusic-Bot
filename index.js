// index.js (Gunakan import untuk semuanya)
import { Client, IntentsBitField } from 'discord.js';
import 'dotenv/config';

// --- PERBAIKAN IMPORT COMMONJS ---
// Node.js memaksa file ini menjadi ES Module, jadi kita harus mengimpor paket CommonJS
// (seperti discord-player dan extractor) melalui default import.

import discordPlayerPkg from 'discord-player';
const { Player } = discordPlayerPkg;

import extractorPkg from '@discord-player/extractor';
const { ExtractorFactory } = extractorPkg;
// ---------------------------------


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

// Tangani event error (disarankan)
player.on('error', (queue, error) => {
    console.log(`[Player Error] ${error.message}`);
});

player.events.on('playerError', (queue, error) => {
    console.log(`[Player Track Error] ${error.message}`);
});

// Import commands (Pastikan commands.js Anda adalah file ES Module yang valid)
import('./commands.js'); 

client.login(process.env.TOKEN);
