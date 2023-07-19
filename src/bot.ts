import { botToken, clientId } from "./config";

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

const BOT_PREFIX = "!moo";

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

	// Splits the string by whitespace, first element will always be the prefix
	// so ignore it. Next one will always be the "command name".
	// The rest will be the arguments to pass to the handler.
	const [_, commandType, ...restArgs] = content.split(/[ ]+/);

	// fetch the channel this came from to get the full channel 
	await message.channel.fetch();

	console.log("commandType and restArgs together", commandType, restArgs);

	switch (commandType.toLowerCase()) {
		case "join": 
			joinImport.textHandler(message, restArgs);
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
			disconnectImport.execute(interaction);
			break;
		case "play":
			playImport.execute(interaction, client, player);
			break;
		case "queue":
			queueImport.execute(interaction);
			break;
		case "skip":
			skipImport.execute(interaction);
			break;
		case "clear":
			clearImport.execute(interaction);
			break;
	}
});

client.on(Events.ClientReady, () => {
	console.log(`Logged in as ${client.user?.tag}`);
});

client.login(botToken);
