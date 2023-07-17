const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require("discord-player");
const { myVoiceChannels } = require('../voiceChannels.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('skips current song'),
    
    execute: async (interaction) =>{
        const queue = useQueue(interaction.guild.id);
        queue.node.skip();

        await interaction.reply('skipping');
    }

}