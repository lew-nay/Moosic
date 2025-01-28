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
import { Player, useQueue, GuildQueuePlayerNode, GuildQueue, useMainPlayer } from "discord-player";
import { lyricsExtractor } from "@discord-player/extractor";

type ReplyFunction = typeof CommandInteraction.prototype.reply | Message['reply'];

const lyrics = async (channel: VoiceBasedChannel | null, messageChannel: TextChannel | null, guild: Guild, reply: ReplyFunction) => {
    const queue = useQueue(guild.id);
    const currentTrack = queue!.currentTrack;
  

    const player = useMainPlayer()

    if (!currentTrack){
        return reply('No song is currently playing.'); 
    }

    const currentTrackString = currentTrack.cleanTitle;
    console.log('song name: ' + currentTrackString);

    const lyricsResult = await player.lyrics.search({ q: currentTrackString }).catch(() => null);

    //await deferReply();
    

    if (!lyricsResult || lyricsResult.length === 0){
        return reply("Lyrics not found.")
    }

    const lyrics = lyricsResult[0];

    const CHARS_PER_PAGE = 4096;

    const pages = (lyrics.plainLyrics.length / CHARS_PER_PAGE).toFixed(0);
    const totalPages = parseInt(pages);
    console.log('pages:' + totalPages)

    for (let i = 0; i < parseInt(pages); i++) {
        let j = i * 4096;
        const trimmedLyrics = lyrics.plainLyrics.substring(j, j+4096);

        //await reply(trimmedLyrics);

        const lyricsEmbed = new EmbedBuilder()
        .setTitle(lyrics.trackName)
        .setAuthor({ name: lyrics.artistName})
        .setFooter({
            text: lyrics.albumName
        })
        //.setThumbnail(lyrics[0].thumbnail)
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