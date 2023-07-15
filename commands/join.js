const { SlashCommandBuilder, ChannelType, CommandInteraction, Channel } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Moosic joins a voice channel')
        .addChannelOption((option) => 
            option
            .setName('channel')
            .setDescription('the channel to join') //gives the user the option of which voice channel to join
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildVoice)),

    execute: async (interaction) => {
    /**
     * @param {Channel} voiceChannel
     */
        const voiceChannel = interaction.options.getChannel('channel');
        const voiceConnetion = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        await interaction.reply(`joining: ${voiceChannel.name}`);
    }
};