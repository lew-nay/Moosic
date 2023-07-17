const { SlashCommandBuilder, ChannelType, CommandInteraction, Channel } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
const { myVoiceChannels } = require('../voiceChannels.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Moosic joins a voice channel')
        .addChannelOption(option => 
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
        const voiceConnection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        // const onDisconnect = () => {
        //     console.log('i have left, sad');
        //     delete myVoiceChannels[interaction.guild.id];
        //     voiceConnetion.off(VoiceConnectionStatus.Destroyed, onDisconnect);
        // }

        // voiceConnetion.on(VoiceConnectionStatus.Destroyed, onDisconnect)

        myVoiceChannels[interaction.guild.id] = voiceChannel;

        console.log('myVoiceChannels', myVoiceChannels);

        await interaction.reply(`joining: ${voiceChannel.name}`);
    }
};