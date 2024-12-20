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
import { Player, useQueue, GuildQueuePlayerNode, GuildQueue } from "discord-player";
import { lyricsExtractor } from "@discord-player/extractor";

type ReplyFunction = typeof CommandInteraction.prototype.reply | Message['reply'];

const lyrics = async (channel: VoiceBasedChannel | null, messageChannel: TextChannel | null, guild: Guild, reply: ReplyFunction) => {
    const queue = useQueue(guild.id);
    const currentTrack = queue!.currentTrack;
    const lyricsFinder = lyricsExtractor();

    if (!currentTrack){
        return reply('No song is currently playing.'); 
    }

    const currentTrackString = currentTrack!.toString();
    console.log('song name: ' + currentTrackString);

    const lyrics = await lyricsFinder.search(currentTrack!.toString()).catch(() => null);

    //await deferReply();
    
    if (!lyrics){
        return reply("Lyrics not found.")
    }

    const CHARS_PER_PAGE = 4096;

    const pages = (lyrics.lyrics.length / CHARS_PER_PAGE).toFixed(0);
    const totalPages = parseInt(pages);
    console.log('pages:' + totalPages)

    for (let i = 0; i < parseInt(pages); i++) {
        let j = i * 4096;
        const trimmedLyrics = lyrics.lyrics.substring(j, j+4096);

        //await reply(trimmedLyrics);

        const lyricsEmbed = new EmbedBuilder()
        .setTitle(lyrics.title)
        .setAuthor({ name: lyrics.artist.name})
        .setThumbnail(lyrics.thumbnail)
        .setDescription(trimmedLyrics)

    await reply({embeds: [lyricsEmbed]});
    }
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