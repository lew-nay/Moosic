import 'dotenv/config';
import { botToken } from './config';
import {
	Client,
	GatewayIntentBits,
	Events,
	EmbedBuilder,
} from "discord.js"; //classes capitalised
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent // new privledge intent
	],
});

import { Player } from "discord-player";

const player = new Player(client);

import pingImport from "./commands/ping";
import joinImport from "./commands/join";
import disconnectImport from "./commands/disconnect";
import playImport from "./commands/play";
import queueImport from "./commands/queue";
import skipImport from "./commands/skip";
import clearImport from "./commands/clear";
import removeImport from "./commands/remove";

const BOT_PREFIX = "+";

player.on("debug", async (message) => {
	// Emitted when the player sends debug info
	// Useful for seeing what dependencies, extractors, etc are loaded
	console.log(`General player debug event: ${message}`);
});

player.events.on("debug", async (queue, message) => {
	// Emitted when the player queue sends debug info
	// Useful for seeing what state the current queue is at
	console.log(`Player debug event: ${message}`);
});

player.events.on("playerStart", async (queue, track) => {
	const trackEmbed = new EmbedBuilder()
		.setTitle(track.title)
		.setAuthor({ name: "Now playing:" })
		.setThumbnail(track.thumbnail)
		.setDescription(track.author);

    // @ts-ignore
	queue.metadata.send({ embeds: [trackEmbed] });
});

client.on(Events.MessageCreate, async (message) => {
	const content = message.content;

	if (!content.startsWith(BOT_PREFIX)) return;

	// Splits the string by whitespace
	// first element will always be the "command name".
	// The rest will be the arguments to pass to the handler.
	const [commandType, ...restArgs] = content.split(/[ ]+/);
	
	// fetch the channel this came from to get the full channel 
	await message.channel.fetch();

	console.log("commandType and restArgs together", commandType, restArgs);

	switch (commandType.toLowerCase()) {
		case `${BOT_PREFIX}join`: 
			joinImport.textHandler(message, restArgs);
			break;
		case `${BOT_PREFIX}disconnect`:
			disconnectImport.textHandler(message);
			break;
		case `${BOT_PREFIX}play`:
			playImport.textHandler(message, restArgs, player);
			break;
		case `${BOT_PREFIX}queue`:
			queueImport.textHandler(message);
			break;
		case `${BOT_PREFIX}skip`:
			skipImport.textHandler(message);
			break;
		case `${BOT_PREFIX}clear`:
			clearImport.textHandler(message);
			break;
		case `${BOT_PREFIX}remove`:
			removeImport.textHandler(message, restArgs);
			break;
		default:
			message.reply("Command not found");
		return;
	};
});

//Events.InteractionCreate - static is better ;)
client.on(Events.InteractionCreate, async (interaction) => {
	console.log("interactCreateEvent", interaction);
	if (!interaction.isChatInputCommand()) return;

	switch (interaction.commandName) {
		case "ping":
			pingImport.execute(interaction);
			break;
		case "join":
			joinImport.slashHandler(interaction);
			break;
		case "disconnect":
			disconnectImport.slashHandler(interaction);
			break;
		case "play":
			playImport.slashHandler(interaction, player);
			break;
		case "queue":
			queueImport.slashHandler(interaction);
			break;
		case "skip":
			skipImport.slashHandler(interaction);
			break;
		case "clear":
			clearImport.slashHandler(interaction);
			break;
		case "remove":
			removeImport.slashHandler(interaction);
			break;
	}
});

client.on(Events.ClientReady, () => {
	console.log(`Logged in as ${client.user?.tag}`);
});

client.login(botToken);