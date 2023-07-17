const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require("discord-player");
const { myVoiceChannels } = require('../voiceChannels.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('shows currently enqueued songs'),
    
    execute: async (interaction) => {
        const queue = useQueue(interaction.guild.id);
        const tracks = queue.tracks.toArray();

        let bareString = "current queue: \n";

        for (let i = 0; i < tracks.length && bareString.length < 1900; i++) {
            const track = tracks[i];
            bareString += `[${i}] ${track.title} - ${track.author}\n`;
        }
        
        await interaction.reply(bareString);
    }
}