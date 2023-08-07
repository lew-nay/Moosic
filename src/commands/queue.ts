import { 
	SlashCommandBuilder, 
	EmbedBuilder,
	Message,
	Guild,
	CacheType,
	CommandInteraction,
	ChatInputCommandInteraction,
	TextChannel
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

	let i = 0;

	const queueEmbed = new EmbedBuilder()
			.setAuthor({ name: "Current queue:"})
		
	while(i < tracks.length){
		const track = tracks[i];
		let trackToAdd = `${track.title} - ${track.author}`;
		queueEmbed.addFields({name: (i+1).toString(), value: trackToAdd})
	}

	// while (i < tracks.length){
	// 	const track = tracks[i];
	// 	let trackToAdd = `**[${i+1}]:** ${track.title} - ${track.author}\n`;
		
	// 	if ((bareString.length + trackToAdd.length) > 2000){
	// 		await reply(bareString);
	// 		bareString = "";
	// 	}

	// 	bareString += trackToAdd;
	// 	i++
	// }

	await reply({embeds: [queueEmbed]});
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