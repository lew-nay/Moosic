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
    Embed,
	} from "discord.js";
import { joinVoiceChannel } from "@discordjs/voice";
import { myVoiceChannels } from "../voiceChannels";
import { Player, useQueue, GuildQueuePlayerNode, GuildQueue } from "discord-player";
import { lyricsExtractor } from "@discord-player/extractor";

type ReplyFunction = typeof CommandInteraction.prototype.reply | Message['reply'];

const lyrics = async (channel: VoiceBasedChannel | null, messageChannel: TextChannel | null, guild: Guild, reply: ReplyFunction) => {
    const queue = useQueue(guild.id)
    
    if (!queue || queue.isEmpty()){
        return reply('No song is currently playing.'); 
    }
    
    const currentTrack = queue!.currentTrack;
    const lyricsFinder = lyricsExtractor();

    const lyrics = await lyricsFinder.search(currentTrack!.title.toString()).catch(() => null);
    if (!lyrics){
        return reply("Lyrics not found.")
    }
    
    const trimmedLyrics = lyrics.lyrics.substring(0, 1997);

    const lyricsEmbed = new EmbedBuilder()
        .setTitle(currentTrack!.title)
        .setAuthor({ name: currentTrack!.author})
        .setThumbnail(currentTrack!.thumbnail)
        .setDescription(trimmedLyrics);

    await reply({embeds: [lyricsEmbed]});
}

export const slashHandler = async (interaction: ChatInputCommandInteraction<CacheType>, player) => {
    const member = interaction.member as GuildMember;
    const channel = member.voice.channel;
    const textChannel = interaction.channel as TextChannel;

    await interaction.deferReply();

    await lyrics(channel, textChannel, interaction.guild!, interaction.followUp.bind(interaction) as ReplyFunction);
}

export const textHandler = async (message: Message) => {
    const member = message.member!;
    const channel = message.member!.voice.channel;
    const textChannel = message.channel as TextChannel;

    await lyrics(channel, textChannel, member.guild!, message.reply.bind(message));
}

export const data = new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription('Displys the lyrics of the current song')

export default {data, slashHandler, textHandler}