import { 
	SlashCommandBuilder, 
	EmbedBuilder,
	Message,
	Guild,
	CacheType,
	CommandInteraction,
	ChatInputCommandInteraction,
	TextChannel,
	} from "discord.js";
import { useQueue } from "discord-player";

type ReplyFunction = typeof CommandInteraction.prototype.reply | Message['reply'];

const viewQueue =  async(messageChannel: TextChannel | null, guild: Guild, reply: ReplyFunction) => {
	const queue = useQueue(guild.id);

	if (!queue || queue.isEmpty()){
		return reply("Queue is empty.");
	}

	const tracks = queue.tracks.toArray();

	let bareString = "Current queue: \n";

	for (let i = 0; i < 50 && i < tracks.length; i++){
		const track = tracks[i];
		bareString += `**[${i+1}]:** ${track.title} - ${track.author}\n`;
	}

	await reply(bareString);
}

export const slashHandler = async (interaction: ChatInputCommandInteraction<CacheType>) => {
	const channel = interaction.channel as TextChannel;

	await interaction.deferReply();
	
	await viewQueue(channel, interaction.guild!, interaction.followUp.bind(interaction) as ReplyFunction);
}

export const textHandler = async (message: Message) => {
	const channel = message.channel as TextChannel;

	await viewQueue(channel, message.guild!, message.reply.bind(message));
}

export const data = new SlashCommandBuilder()
	.setName("queue")
	.setDescription("Shows currently enqueued songs");


export default {data, slashHandler, textHandler}