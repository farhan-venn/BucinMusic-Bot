import { Client, IntentsBitField } from 'discord.js';
import 'dotenv/config';
import { Player } from 'discord-player'; // Import Player dari discord-player
// Karena kita menambahkan "type": "module", kita bisa import ExtractorFactory
import { ExtractorFactory } from '@discord-player/extractor'; 

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

// WAJIB: Memuat Extractor Factory untuk mengatasi "No current track"
// Ini adalah cara yang benar untuk memuat extractor di lingkungan ES Module.
ExtractorFactory.load(player);
console.log('[Bot] Player initialized with extractors');

// Tangani event error (disarankan)
player.on('error', (queue, error) => {
    console.log(`[Player Error] ${error.message}`);
});

player.events.on('playerError', (queue, error) => {
    console.log(`[Player Track Error] ${error.message}`);
});

// Import commands (sesuaikan dengan cara Anda memuat commands)
import('./commands.js'); 

client.login(process.env.TOKEN);
