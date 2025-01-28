
import { 
	SlashCommandBuilder, 
	EmbedBuilder,
	Message,
	Guild,
	CacheType,
	CommandInteraction,
	ChatInputCommandInteraction,
	GuildMember,
	VoiceBasedChannel,
	TextChannel,
	} from "discord.js";
import {
	SpotifyExtractor,
	SoundCloudExtractor,
	DefaultExtractors,
} from "@discord-player/extractor";
import { joinVoiceChannel, VoiceConnection, getVoiceConnection } from "@discordjs/voice";
import { myVoiceChannels } from "../voiceChannels";
import { Player, useQueue, GuildQueuePlayerNode, GuildQueue, useMainPlayer } from "discord-player";
import { YoutubeiExtractor } from "discord-player-youtubei";

type ReplyFunction = typeof CommandInteraction.prototype.reply | Message['reply'];

const play = async (memberChannel: VoiceBasedChannel | null, messageChannel: TextChannel | null, guild: Guild, reply: ReplyFunction, playerArg: Player, query: string, engine?: string) => {
	const player = useMainPlayer();

	// let queue: GuildQueue;

	// // Check if the bot is in a channel already in this guild
	// if (!myVoiceChannels[guild.id] || myVoiceChannels[guild.id]?.id !== channelToJoin.id){
	
	// 	const voiceConnection = joinVoiceChannel({
	// 		channelId: channelToJoin.id,
	// 		guildId: guild.id,	
	// 		adapterCreator: guild.voiceAdapterCreator,
	// 	});
		
	// 	myVoiceChannels[guild.id] = channelToJoin;

	// 	queue = await player.nodes.create(guild);

	// 	queue.createDispatcher(voiceConnection as any);
	// 	// await reply(`Joining: ${channelToJoin.name}`);
	// } else {
	// 	queue = useQueue(guild.id)!;
	// }
// 
	const voiceChannel = myVoiceChannels[guild.id] || memberChannel;

	if (!voiceChannel) 
		return void await reply("A voice channel could not be found to play in.");

	try {
		const { track, queue } = await player.play(voiceChannel, query, {
			nodeOptions: {
				metadata: messageChannel, //metadata is what gets passed into the events,
			},
			searchEngine: engine as any,
			audioPlayerOptions: {
				transitionMode: true,
				queue: true,
			},
		});

		const numberingQueue = new GuildQueuePlayerNode(queue);

		const trackNumber = numberingQueue.getTrackPosition(track) + 1;

		const playEmbed = new EmbedBuilder()
				.setTitle(track.title)
				.setAuthor({name: 'Enqueued:'})
				.setThumbnail(track.thumbnail)
				.setDescription(track.author)
				.addFields({ name: 'Queue position:', value: trackNumber.toString() });

		await reply({embeds: [playEmbed]});
	} 
	catch (e) 
		{
		await reply(`Something went wrong: ${e}.`);
		console.log(e);
	}
}

export const slashHandler = async (interaction: ChatInputCommandInteraction<CacheType>, player) => {
	// message // non existent
	const query = interaction.options.getString("query");
	const engine = interaction.options.getString("engine");
	// our engine is string | null

	const member = interaction.member as GuildMember;
	const channel = member.voice.channel;
	const textChannel = interaction.channel as TextChannel;

	await interaction.deferReply();

	await play(channel, textChannel, interaction.guild!, interaction.followUp.bind(interaction) as ReplyFunction, player, query!, engine ?? undefined);
}

export const textHandler = async (message: Message, args: string[], player) => {
	const query = args.join();

	const channel = message.member!.voice.channel;
	const textChannel = message.channel as TextChannel;

	await play(channel, textChannel, message.guild!, message.reply.bind(message), player, query!);
}

export const data = new SlashCommandBuilder()
	.setName("play")
	.setDescription("Moosic will play audio")
	.addStringOption((option) =>
		option
			.setName("query")
			.setDescription("search for a song")
			.setRequired(true),
	)
	.addStringOption((option) =>
		option
			.setName("engine")
			.setDescription("the platform to search on")
			.addChoices(
				{
					name: "Youtube",
					value: `ext:${YoutubeiExtractor.identifier}`,
				},
				{
					name: "Spotify",
					value: `ext:${SpotifyExtractor.identifier}`,
				},
				{
					name: "SoundCloud",
					value: `ext:${SoundCloudExtractor.identifier}`,
				},
			),
	);

export default {data, slashHandler, textHandler}
