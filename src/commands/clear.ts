import { 
	SlashCommandBuilder, 
	EmbedBuilder,
	Message,
	Guild,
	CacheType,
	CommandInteraction,
	ChatInputCommandInteraction,
	TextChannel,
	InteractionCollector,
	} from "discord.js";
import { useQueue } from "discord-player";

type ReplyFunction = typeof CommandInteraction.prototype.reply | Message['reply'];

const clearQueue = async(messageChannel: TextChannel | null, guild: Guild, reply: ReplyFunction) => {
	const queue = useQueue(guild.id);
	queue?.clear();

	await reply('Queue cleared');
}

export const slashHandler = async (interaction: ChatInputCommandInteraction<CacheType>) => {
	const channel = interaction.channel as TextChannel;

	await interaction.deferReply();

	await clearQueue(channel, interaction.guild!, interaction.followUp.bind(interaction) as ReplyFunction);
}

export const textHandler = async (message: Message) => {
	const channel = message.channel as TextChannel;

	await clearQueue(channel, message.guild!, message.reply.bind(message));
}

export const data = new SlashCommandBuilder()
	.setName("clear")
	.setDescription("Clears the queue");

export default {data, slashHandler, textHandler}
