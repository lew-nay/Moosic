const { createAudioPlayer, NoSubscriberBehavior, createAudioResource } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('discord.js');
const { Player } = require('discord-player');
const { SpotifyExtractor } = require('@discord-player/extractor');
const { Client, GuildVoiceStates } = require('discord.js');
const { myVoiceChannels } = require('../voiceChannels.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Moosic will play audio')
        .addStringOption(option => 
            option
            .setName('youtube')
            .setDescription('enter a query to be searched on youtube'))
        .addStringOption(option =>
            option
            .setName('spotify')
            .setDescription('search through spotify')),
    
    execute: async (interaction) => {
        const client = new Client({ intents: [GuildVoiceStates]});
        const player = new Player(client);

        await player.extractors.loadDefault();

        const channel = myVoiceChannels[interaction.member.voice.channel];
        if(!channel) return interaction.reply('not connected to a channel');
        
        const query = interaction.options.getString(query, true);

        try {
            const{ track } = await player.play(channel, query, {
                nodeOptions: {
                    metadata: interaction
                }
            });
            return interaction.followUp(`**${track.title}** enqueued`);

        }
        catch(e){
            return interaction.followUp(`something went wrong: ${e}`);
        }
    }
};