
import { 
	SlashCommandBuilder, 
	EmbedBuilder,
	Message,
	Guild,
	CacheType,
	CommandInteraction,
	ChatInputCommandInteraction,
	VoiceChannel,
	type Client,
	Interaction,
	GuildMember,
	VoiceBasedChannel,
	} from "discord.js";
import {
	SpotifyExtractor,
	YoutubeExtractor,
	SoundCloudExtractor,
} from "@discord-player/extractor";
import { joinVoiceChannel } from "@discordjs/voice";
import { myVoiceChannels } from "../voiceChannels";
import { Player } from "discord-player";

type ReplyFunction = typeof CommandInteraction.prototype.reply | Message['reply'];

// im going  to remove message as arguement so errors can show where needs fix
const play = async (channelToJoin: VoiceBasedChannel | null, guild: Guild, reply: ReplyFunction, player: Player, query: string, engine?: string) => {

	// Check if the bot is in a channel already in this guild
	if (!myVoiceChannels[guild.id] || myVoiceChannels[guild.id] !== channelToJoin){
		
		if (!channelToJoin) {
			// error here "you are not in a channel etc".
			await reply("join voice channel first idot");
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
				metadata: channelToJoin, //metadata is what gets passed into the events
			},
			searchEngine: engine as any,
		});
		await reply(
			`${track.title} - ${track.author} enqueued`,
		);
	} catch (e) {
		await reply(`Something went wrong: ${e}`);
	}
}

export const slashHandler = async (interaction: ChatInputCommandInteraction<CacheType>, player) => {
	// message // non existent
	const query = interaction.options.getString("query");
	const engine = interaction.options.getString("engine");
	// our engine is string | null

	const member = interaction.member as GuildMember;

	const channel = member.voice.channel;

	await interaction.deferReply();

	await play(channel, interaction.guild!, interaction.followUp.bind(interaction) as ReplyFunction, player, query!, engine ?? undefined);
}

export const textHandler = async (message: Message, args: string[]) => {
	const query = args[0];
	const platform = args[1];

	if (!message.member!.voice.channel){
		return(message.reply('You are not in a voice channel'))
	}

	

	// if (!myVoiceChannels[guild.id]){
	// 	const voiceChannel = message.member!.voice.channel;

	// 	const voiceConnection = joinVoiceChannel({
	// 		channelId: message.member!.guild.id,
	// 		guildId: message.guildId,
	// 		adapterCreator: message.guild!.voiceAdapterCreator,
	// 	});

	// 	myVoiceChannels[guild.id] = voiceChannel;

	// 	await message.reply(`Joining: ${voiceChannel.name}`);
	// }
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

// export const execute = async (interaction, client, player) => {
// 	await interaction.deferReply();

// 	if (!interaction.member.voice.channel) {
// 		return interaction.followUp("You are not connected to a voice channel");
// 	}

// 	if (!myVoiceChannels[interaction.guild.id]) {
// 		const voiceChannel = interaction.member.voice.channel;

// 		const voiceConnection = joinVoiceChannel({
// 			channelId: interaction.member.guild.id,
// 			guildId: interaction.guildId,
// 			adapterCreator: interaction.guild.voiceAdapterCreator,
// 		});

// 		myVoiceChannels[interaction.guild.id] = voiceChannel;

// 		await interaction.followUp(`Joining: ${voiceChannel.name}`);
// 	}

// 	const query = interaction.options.getString("query");
// 	const engine = interaction.options.getString("engine");

// 	const channel = myVoiceChannels[interaction.guild.id];

// 	await player.extractors.loadDefault();

// 	try {
// 		const { track } = await player.play(channel, query, {
// 			nodeOptions: {
// 				metadata: interaction.channel, //metadata is what gets passed into the events
// 			},
// 			searchEngine: engine,
// 		});
// 		return interaction.followUp(
// 			`${track.title} - ${track.author} enqueued`,
// 		);
// 	} catch (e) {
// 		return interaction.followUp(`Something went wrong: ${e}`);
// 	}
// };

export default {data, slashHandler, textHandler}