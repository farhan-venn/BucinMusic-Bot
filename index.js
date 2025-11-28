require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { Player } = require("discord-player");
const { DefaultExtractors } = require("@discord-player/extractor");
const fs = require("fs");
const express = require("express");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

async function initializePlayer() {
  try {
    client.player = new Player(client, {
      connectionTimeout: 120000,
      lagMonitor: 60000,
      skipFFmpeg: false,
      ytdlOptions: {
        quality: "lowestaudio",
        highWaterMark: 1 << 25,
        requestOptions: {
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        }
      }
    });

    await client.player.extractors.loadMulti(DefaultExtractors);
    console.log('[Bot] Player initialized with extractors');

    // Handle player errors
    client.player.on('error', (error, queue) => {
      console.error('[Player Global Error]:', error);
    });

    client.player.on('playerError', (error, queue) => {
      console.error('[Player Error]:', error);
    });

    client.player.on('playerStart', (queue, track) => {
      console.log(`[Player] Started playing: ${track.title}`);
      queue.metadata?.send(`🎵 Now playing: **${track.title}**`).catch(() => {});
    });

    client.player.on('playerFinish', (queue) => {
      console.log('[Player] Track finished');
    });

  } catch (err) {
    console.error('[Bot] Failed to initialize player:', err.message);
  }
}

client.on('ready', async () => {
  if (!client.player) await initializePlayer();
  console.log(`${client.user.tag} online!`);
});

client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));
for (const file of commandFiles) {
  const cmd = require(`./commands/${file}`);
  client.commands.set(cmd.data.name, cmd);
}

const eventFiles = fs.readdirSync("./events").filter(f => f.endsWith(".js"));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
  else client.on(event.name, (...args) => event.execute(...args, client));
}

const app = express();
app.get("/", (req, res) => res.send("Bot is running"));
app.listen(3000, () => console.log("Keep-alive server running"));

client.login(process.env.TOKEN);
