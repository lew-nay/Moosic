import { SlashCommandBuilder, ChannelType, CommandInteraction, Channel } from 'discord.js';
import { joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice';
import { myVoiceChannels } from '../voiceChannels';



export const data = new SlashCommandBuilder()
    .setName('join')
    .setDescription('Moosic joins a voice channel')
    .addChannelOption(option => 
        option
        .setName('channel')
        .setDescription('the channel to join') //gives the user the option of which voice channel to join
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildVoice));

export const execute = async (interaction) => {

    const voiceChannel = interaction.options.getChannel('channel');
    const voiceConnection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    myVoiceChannels[interaction.guild.id] = voiceChannel;

    console.log('myVoiceChannels', myVoiceChannels);

    await interaction.reply(`Joining: ${voiceChannel.name}`);
}

export default {data, execute}