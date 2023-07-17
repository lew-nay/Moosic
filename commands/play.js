const { createAudioPlayer, NoSubscriberBehavior, createAudioResource } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('discord.js');
const { Player } = require('discord-player');
const { SpotifyExtractor, YoutubeExtractor, SoundCloudExtractor } = require('@discord-player/extractor');
const { Client, GatewayIntentBits, GuildVoiceStates } = require('discord.js');
//const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GuildVoiceStates]});
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
                .setDescription('The platform to search on')
                .addChoices(
                    { name: 'Youtube', value: `ext:${YoutubeExtractor.identifier}` },
                    { name: 'Spotify', value: `ext:${SpotifyExtractor.identifier}` },
                    { name: 'SoundCloud', value: `ext:${SoundCloudExtractor.identifier}` },
                )),  
       
    
    execute: async (interaction, client) => {
        //const client = new Client({ intents: [GuildVoiceStates]});
        const player = new Player(client);

        const query = interaction.options.getString('query');
        const engine = interaction.options.getString('engine');

        await interaction.deferReply();

        await player.extractors.loadDefault();

        const channel = myVoiceChannels[interaction.guild.id];
        if(!channel) return interaction.reply('not connected to a channel');

        try {
            const{ track } = await player.play(channel, query, {
                nodeOptions: {
                    metadata: interaction
                },
                searchEngine: engine
            });
            return interaction.followUp(`**${track.title}** enqueued`);

        }
        catch(e){
            return interaction.followUp(`something went wrong: ${e}`);
        }
    }
};