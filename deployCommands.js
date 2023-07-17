
const { botToken, clientId } = require('./config.js');
const pingImport = require("./commands/ping.js");
const joinImport = require('./commands/join.js');
const disconnectImport = require('./commands/disconnect.js');
const playImport = require('./commands/play.js');
const skipImport = require('./commands/skip.js');
const queueImport = require('./commands/queue.js');
const { REST, Routes, } = require("discord.js"); //classes capitalised

//sets up the slash commands
async function setupCommands() {
    const commands = [
        pingImport.data,
        joinImport.data,
        disconnectImport.data,
        playImport.data,
        skipImport.data,
        queueImport.data,
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