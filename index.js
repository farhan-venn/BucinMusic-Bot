// index.js (Solusi Akhir ESM)
import { Client, IntentsBitField } from 'discord.js';
import 'dotenv/config';

// Import langsung Player dan ExtractorFactory.
// Ini bekerja karena package.json sekarang menggunakan "type": "module"
import { Player } from 'discord-player'; 
import { ExtractorFactory } from '@discord-player/extractor';
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

// Baris ini akan berhasil karena objek sudah didefinisikan melalui named import
ExtractorFactory.load(player);
console.log('[Bot] Player initialized with extractors');

// Tangani event error 
player.on('error', (queue, error) => {
    console.log(`[Player Error] ${error.message}`);
});

player.events.on('playerError', (queue, error) => {
    console.log(`[Player Track Error] ${error.message}`);
});

// Import commands
import('./commands.js'); 

client.login(process.env.TOKEN);
