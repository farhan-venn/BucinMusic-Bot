const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

class GuildQueue {
  constructor() {
    this.songs = []; // { title, url, requestedBy, duration }
    this.player = createAudioPlayer();
    this.currentResource = null;
    this.loop = false;
  }

  enqueue(song) {
    this.songs.push(song);
  }

  dequeue() {
    return this.songs.shift();
  }

  nowPlaying() {
    return this.songs[0] || null;
  }

  clear() {
    this.songs = [];
  }
}

module.exports = GuildQueue;