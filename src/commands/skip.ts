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
import { TrackSkipReason, useQueue } from "discord-player";

type ReplyFunction = typeof CommandInteraction.prototype.reply | Message['reply'];

const skip = async(messageChannel: TextChannel | null, guild: Guild, reply: ReplyFunction) => {
	const queue = useQueue(guild.id);

	if (!queue) {
		await reply("No queue.");
		return;
	}

	console.log('Queue: ', queue?.currentTrack?.title, queue?.node.estimatedDuration, queue?.node.createProgressBar());

	const track = queue?.currentTrack;

	if (!track) {
		await reply('No track currently playing.');
		return;
	}

	const tst = queue.node.skip({
		description: "Skipped by a pleb",
		reason: TrackSkipReason.Manual
	});

	console.log('Skip result', tst);

	const skipEmbed = new EmbedBuilder()
			.setTitle(track.title)
			.setAuthor({name: 'Skipping:'})
			.setThumbnail(track.thumbnail)
			.setDescription(track.author);

	await reply({embeds: [skipEmbed]});
}

export const data = new SlashCommandBuilder()
	.setName("skip")
	.setDescription("Skips current song");

export const slashHandler = async(interaction: ChatInputCommandInteraction<CacheType>) => {
	const channel = interaction.channel as TextChannel;

	await interaction.deferReply();

	await skip(channel, interaction.guild!, interaction.followUp.bind(interaction) as ReplyFunction); 
}

export const textHandler = async (message: Message) => {
	const channel = message.channel as TextChannel;

	await skip(channel, message.guild!, message.reply.bind(message));
}

export default {data, slashHandler, textHandler}