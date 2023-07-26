import {
	SlashCommandBuilder,
	CommandInteraction,
	Message,
	Guild,
	ChatInputCommandInteraction,
	CacheType
	} from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
import { myVoiceChannels } from "../voiceChannels";

type ReplyFunction = typeof CommandInteraction.prototype.reply | Message['reply'];

const disconnect = async (guild: Guild, reply: ReplyFunction) => {
	
	const channel = myVoiceChannels[guild.id];

	const connection = getVoiceConnection(channel.guild.id);
	connection?.destroy();

	await reply(`Disconnecting from: **${channel.name}**`);
	delete myVoiceChannels[guild.id];
}

export const data = new SlashCommandBuilder()
	.setName("disconnect")
	.setDescription("Moosic disconnects from voice channel");

export const slashHandler = async (interaction: ChatInputCommandInteraction<CacheType>) => {
	await disconnect(interaction.guild!, interaction.reply.bind(interaction));
}

export const textHandler = async (message: Message) => {
	const cachedChannel = message.guild!.channels.cache.find(channel => channel.name?.toLowerCase());

	if (!cachedChannel) return message.reply('Not connected to a channel');

	await disconnect(message.guild!, message.reply.bind(message));
}

export default {data, slashHandler, textHandler}