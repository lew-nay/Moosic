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

import joinImport from "./commands/join";
import disconnectImport from "./commands/disconnect";
import playImport from "./commands/play";
import queueImport from "./commands/queue";
import skipImport from "./commands/skip";
import clearImport from "./commands/clear";
import removeImport from "./commands/remove";
import shuffleImport from "./commands/shuffle";
import lyricsImport from "./commands/lyrics";

const BOT_PREFIX = "+";

const commandMap = {
	[`${BOT_PREFIX}join`]: joinImport,
	[`${BOT_PREFIX}disconnect`]: disconnectImport,
	[`${BOT_PREFIX}play`]: playImport,
	[`${BOT_PREFIX}queue`]: queueImport,
	[`${BOT_PREFIX}skip`]: skipImport,
	[`${BOT_PREFIX}clear`]: clearImport,
	[`${BOT_PREFIX}remove`]: removeImport,
	[`${BOT_PREFIX}shuffle`]: shuffleImport,
	[`${BOT_PREFIX}lyrics`]: lyricsImport,
};

//console.log('loaded commands', commandMap);

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

	const commandHandler = commandMap[commandType.toLowerCase()];

	if (!commandHandler) {
		message.reply("Command not found");
		return;
	}

	// may be useful in future if different handlers have VERY different signatures
	// const ctx = {
	// 	message,
	// 	restArgs,
	// 	player,
	// 	// ...
	// }

	await commandHandler.textHandler(message, restArgs, player);
});

//Events.InteractionCreate - static is better ;)
client.on(Events.InteractionCreate, async (interaction) => {
	console.log("interactCreateEvent", interaction);
	if (!interaction.isChatInputCommand()) return;

	const commandHandler = commandMap[BOT_PREFIX + interaction.commandName];

	await commandHandler.slashHandler(interaction, player);
});

client.on(Events.ClientReady, () => {
	console.log(`Logged in as ${client.user?.tag}`);
});

client.login(botToken);