// index.js (Solusi Stabil ESM/CommonJS)
import { Client, IntentsBitField } from 'discord.js';
import 'dotenv/config';

// 1. Impor paket CommonJS sebagai objek default (pkg)
import discordPlayerPkg from 'discord-player';
import extractorPkg from '@discord-player/extractor';

// 2. Ekstrak kelas yang dibutuhkan dari objek default yang sudah diimpor
const { Player } = discordPlayerPkg;
const { ExtractorFactory } = extractorPkg; 
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
    // Menggunakan username karena discriminator deprecated
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

// Baris ini sekarang seharusnya berhasil karena ExtractorFactory sudah terdefinisi
ExtractorFactory.load(player);
console.log('[Bot] Player initialized with extractors');

// Tangani event error 
player.on('error', (queue, error) => {
    console.log(`[Player Error] ${error.message}`);
});

player.events.on('playerError', (queue, error) => {
    console.log(`[Player Track Error] ${error.message}`);
});

// Gunakan import untuk commands (sesuai dengan mode ESM)
import('./commands.js'); 

client.login(process.env.TOKEN);
