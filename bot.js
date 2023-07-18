const { botToken, clientId } = require('./config.js');

const { Client, GatewayIntentBits, Message, SlashCommandBuilder, REST, Routes, Events, EmbedBuilder } = require("discord.js") //classes capitalised
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates]});


const { Player } = require('discord-player');

const player = new Player(client);

const pingImport = require("./commands/ping.js");
const joinImport = require('./commands/join.js');
const disconnectImport = require('./commands/disconnect.js');
const playImport = require('./commands/play.js');
const queueImport = require('./commands/queue.js');
const skipImport = require('./commands/skip.js');
const clearImport = require('./commands/clear.js');

player.on('debug', async (message) => {
    // Emitted when the player sends debug info
    // Useful for seeing what dependencies, extractors, etc are loaded
    console.log(`General player debug event: ${message}`);
});

player.events.on('debug', async (queue, message) => {
    // Emitted when the player queue sends debug info
    // Useful for seeing what state the current queue is at
    console.log(`Player debug event: ${message}`);
});

player.events.on('playerStart', async (queue, track) => {
    const trackEmbed = new EmbedBuilder()
        .setTitle(track.title)
        .setAuthor({name: 'Now playing:'})
        .setThumbnail(track.thumbnail)
        .setDescription(track.author);
    
    queue.metadata.send({ embeds: [trackEmbed]});
})

//Events.InteractionCreate - static is better ;)
client.on(Events.InteractionCreate, async interaction => {

    console.log('interactCreateEvent', interaction);
    if (!interaction.isChatInputCommand()) return;

    switch(interaction.commandName){
        case 'ping':
            pingImport.execute(interaction);
            break;
        case 'join':
            joinImport.execute(interaction);
            break;
        case 'disconnect':
            disconnectImport.execute(interaction);
            break;
        case 'play':
            playImport.execute(interaction, client, player);
            break;
        case 'queue':
            queueImport.execute(interaction);
            break;
        case 'skip':
            skipImport.execute(interaction);
            break;
        case 'clear':
            clearImport.execute(interaction);
            break;
    }
});

client.on(Events.ClientReady, () =>{
    console.log(`Logged in as ${client.user.tag}`)
});


client.login(botToken);