
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
	YoutubeExtractor,
	SoundCloudExtractor,
} from "@discord-player/extractor";
import { joinVoiceChannel } from "@discordjs/voice";
import { myVoiceChannels } from "../voiceChannels";
import { Player, useQueue } from "discord-player";

type ReplyFunction = typeof CommandInteraction.prototype.reply | Message['reply'];

// im going  to remove message as arguement so errors can show where needs fix
const play = async (channelToJoin: VoiceBasedChannel | null, messageChannel: TextChannel | null, guild: Guild, reply: ReplyFunction, player: Player, query: string, engine?: string) => {

	// Check if the bot is in a channel already in this guild
	if (!myVoiceChannels[guild.id] || myVoiceChannels[guild.id] !== channelToJoin){
		
		if (!channelToJoin) {
			// error here "you are not in a channel etc".
			await reply("You are not in a voice channel.");
			return;
		}
	
		const voiceConnection = joinVoiceChannel({
			channelId: channelToJoin.id,
			guildId: guild.id,	// this should be guild.id from guild
			adapterCreator: guild.voiceAdapterCreator, // this is just the guild.voiceAdapater
		});
		
		// yes! this one way, alternative is to use channelToJOin in the joinVoiceChannle function instead
		myVoiceChannels[guild.id] = channelToJoin;

		// await reply(`Joining: ${channelToJoin.name}`);
	} 

	await player.extractors.loadDefault();

	try {
		const { track } = await player.play(channelToJoin, query, {
			nodeOptions: {
				metadata: messageChannel, //metadata is what gets passed into the events
			},
			searchEngine: engine as any,
		});

		const queue = useQueue(guild.id);
		const tracks = queue?.tracks.toArray();
		
		let trackNumber: number;

		if (!queue || queue.isEmpty()){
			trackNumber = 1;
		}
		else {
			trackNumber = tracks!.length;
		}

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
					value: `ext:${YoutubeExtractor.identifier}`,
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