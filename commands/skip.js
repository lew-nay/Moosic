const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips current song'),
    
    execute: async (interaction) =>{
        const queue = useQueue(interaction.guild.id);
        track = queue.currentTrack;
        queue.node.skip();

        await interaction.reply(`Skipping ${track.title} - ${track.author}`);
    }

}