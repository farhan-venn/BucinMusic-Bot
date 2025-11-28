// index.js 
import { Client, IntentsBitField } from 'discord.js';
import 'dotenv/config';

// Import kedua paket CommonJS sebagai objek default (pkg)
import discordPlayerPkg from 'discord-player';
import extractorPkg from '@discord-player/extractor';

// Ekstrak Player dan ExtractorFactory dari objek default tersebut
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
    // Kita menggunakan client.user.username 
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

// Baris ini akan bekerja karena ExtractorFactory seharusnya sudah terdefinisi
ExtractorFactory.load(player);
console.log('[Bot] Player initialized with extractors');

// Tangani event error 
player.on('error', (queue, error) => {
    console.log(`[Player Error] ${error.message}`);
});

player.events.on('playerError', (queue, error) => {
    console.log(`[Player Track Error] ${error.message}`);
});

// Import commands (Kita kembali ke import jika file lain menggunakan import)
import('./commands.js'); 

client.login(process.env.TOKEN);
