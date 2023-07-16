const botToken = "MTEyNzg4MjA4NjczMzMzMjU1MA.GbIRgh.e3u6hH7z-RNMcY5LFr28iE0NxC99FFzmXLY28M"
const clientId = "1127882086733332550"

const { Client, GatewayIntentBits, Message, SlashCommandBuilder, REST, Routes, Events } = require("discord.js") //classes capitalised
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]});

const pingImport = require("./commands/ping.js");
const joinImport = require('./commands/join.js');
const disconnectImport = require('./commands/disconnect.js');
const playImport = require('./commands/play.js');


//Events.InteractionCreate - static is better ;)
client.on(Events.InteractionCreate, async interaction => {

    console.log('interactCreateEvent', interaction);
    if (!interaction.isChatInputCommand()) return;

    switch(interaction.isChatInputCommand()){
        case interaction.commandName === 'ping':
            pingImport.execute(interaction);
            break;
        case interaction.commandName === 'join':
            joinImport.execute(interaction);
            break;
        case interaction.commandName === 'disconnect':
            disconnectImport.execute(interaction);
            break;
        case interaction.commandName === 'play':
            playImport.execute(interaction);
            break;
    }
});

client.on(Events.Ready, () =>{
    console.log(`Logged in as ${client.user.tag}`)
});


client.login(botToken);

//sets up the slash commands
async function setupCommands() {
    const commands = [
        pingImport.data,
        joinImport.data,
        disconnectImport.data,
        playImport.data,
    ];
    
    //idk what this actually does, was in the example, doesn't work without it
    const rest = new REST({ version: '10' }).setToken(botToken);
    
    try {
        //checks that the / commands have actually loaded
        console.log('Started refreshing application (/) commands.');
    
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
    
        console.log('Successfully reloaded application (/) commands.');
    } 
    catch (error) {
        console.error(error);
    }
}

setupCommands();