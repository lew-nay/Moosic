const { createAudioPlayer, NoSubscriberBehavior, createAudioResource } = require('@discordjs/voice');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { SpotifyExtractor, YoutubeExtractor, SoundCloudExtractor } = require('@discord-player/extractor');
const { Client, GatewayIntentBits, GuildVoiceStates } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { myVoiceChannels } = require('../voiceChannels.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Moosic will play audio')
        //.addStringOption(option => 
        //     option
        //     .setName('youtube')
        //     .setDescription('enter a query to be searched on youtube'))
        .addStringOption(option =>
            option
                .setName('query')
                .setDescription('search for a song')
                .setRequired(true)
        )
        .addStringOption(option =>
		    option.setName('engine')
                .setDescription('the platform to search on')
                .addChoices(
                    { name: 'Youtube', value: `ext:${YoutubeExtractor.identifier}` },
                    { name: 'Spotify', value: `ext:${SpotifyExtractor.identifier}` },
                    { name: 'SoundCloud', value: `ext:${SoundCloudExtractor.identifier}` },
                )),  
       
    
    execute: async (interaction, client, player) => {
        await interaction.deferReply();

        if(!interaction.member.voice.channel){
            return interaction.followUp('You are not connected to a voice channel');
        }

        if(!myVoiceChannels[interaction.guild.id]){
            const voiceChannel = interaction.member.voice.channel;
            
            const voiceConnection = joinVoiceChannel({
                channelId: interaction.member.guild.id,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });
        
            myVoiceChannels[interaction.guild.id] = voiceChannel;

            await interaction.followUp(`Joining: ${voiceChannel.name}`);
        }

        const query = interaction.options.getString('query');
        const engine = interaction.options.getString('engine');

        const channel = myVoiceChannels[interaction.guild.id];

        await player.extractors.loadDefault();

        try {
            const{ track } = await player.play(channel, query, {
                nodeOptions: {
                    metadata: interaction.channel //metadata is what gets passed into the events
                },
                searchEngine: engine
            });
            return interaction.followUp(`${track.title} - ${track.author} enqueued`);

        }
        catch(e){
            return interaction.followUp(`Something went wrong: ${e}`);
        }
    }
};
