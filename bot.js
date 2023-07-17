const { botToken, clientId } = require('./config.js');

const { Client, GatewayIntentBits, Message, SlashCommandBuilder, REST, Routes, Events } = require("discord.js") //classes capitalised
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates]});

const pingImport = require("./commands/ping.js");
const joinImport = require('./commands/join.js');
const disconnectImport = require('./commands/disconnect.js');
const playImport = require('./commands/play.js');

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
            playImport.execute(interaction, client);
            break;
    }
});

client.on(Events.ClientReady, () =>{
    console.log(`Logged in as ${client.user.tag}`)
});


client.login(botToken);