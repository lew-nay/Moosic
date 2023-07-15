const botToken = "MTEyNzg4MjA4NjczMzMzMjU1MA.GbIRgh.e3u6hH7z-RNMcY5LFr28iE0NxC99FFzmXLY28M"
const clientId = "1127882086733332550"
// const testimporter = require("./testimporter.js") 
const { Client, GatewayIntentBits, Message, SlashCommandBuilder, REST, Routes, Events } = require("discord.js") //classed capitalised
const { joinVoiceChannel, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const pingImport = require("./commands/ping.js");

// I think this needs to go into a command response instead of the top level
// i cant see terminal :( okook fair enough, i cant see terminal output is it running?
// if you check the link i sent this is all they have on their guide to do with voice connections

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]});

// does this make sense? Events.InteractionCreate? - static is better ;)
client.on(Events.InteractionCreate, async interaction => {

    console.log('interactCreateEvent', interaction);
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping'){
        await pingImport.execute(interaction);
    }

    if (interaction.commandName === 'join') {

        const channel = client.channels.cache.get(connection.channelId);
        if(!channel) return console.error("No channel ID found");

        const connection = joinVoiceChannel({
            channelId: channel.id, 
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        })

        const currentConnection = getVoiceConnection(myVoiceChannel.guild.id);

        const subscription = connection.subscribe(audioPlayer); //will play audio on the voice conneciton
        
        
        channel.join().then(connection => {
            console.log("Connected")
        }).catch(console.error(error));
    }
});

client.on(Events.Ready, () =>{
    console.log(`Logged in as ${client.user.tag}`)
});

client.on(Events.MessageCreate, async message =>{
    if(message.author.bot) return;

    console.log('reply', message )
    await message.reply("This is a reply").catch(console.error) //add the catch just in case
});

client.login(botToken);

//TODO: put this in its own file eventually and export the commands out of it
async function setupCommands() {
    const commands = [
        pingImport.data,
        {
            name: 'join',
            description: 'Moosic will join the current voice channel',
        },
        {
            name: 'disconnect',
            description: 'Moosic will diconnect from the channel',
        }
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




//for reference
// class MyClass {
//     // no fields

//     constructor() {
//         this.name = "myname";

//     }
// }

// const newClass = new MyClass();
// newClass.name; // valid

// const lastEl = myName.someElse.pop();
// const myNumber = 1234;

// for(let i = 0; i < 10; i++) {
//     console.log('Nathan is a penis', i);
// }

// testimport.myFunc()
