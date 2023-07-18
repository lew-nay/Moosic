const { SlashCommandBuilder, CommandInteraction, Channel, ChannelType } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { myVoiceChannels } = require('../voiceChannels.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('Moosic disconnects from voice channel'),
        
    execute: async (interaction) => {
        const channel = myVoiceChannels[interaction.guild.id];
        
        if (!channel) return interaction.reply('Not connected to a channel');

        const connection = getVoiceConnection(interaction.guild.id);
        connection.destroy();

        await interaction.reply(`Disconnecting from: ${channel.name}`)
        delete myVoiceChannels[interaction.guild.id];
    }
}