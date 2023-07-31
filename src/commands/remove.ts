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

const remove = async(messageChannel: TextChannel | null, trackNumber, guild: Guild, reply: ReplyFunction) => {
    const queue = useQueue(guild.id);
    const tracks = queue?.tracks.toArray();
    
    if (!queue || queue.isEmpty()){
        return reply('Queue is empty.');
    }

    const track = tracks![trackNumber-1];

    if (tracks!.length < trackNumber || trackNumber <= 0){
        return reply('Track not found.');
    }
    
    const removeEmbed = new EmbedBuilder()
            .setTitle(track.title)
            .setAuthor({name: 'Removed:'})
            .setThumbnail(track.thumbnail)
            .setDescription(track.author)

    await reply({embeds: [removeEmbed]})
    queue.removeTrack(trackNumber-1);
}

export const data = new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Removes chosen track')
        .addStringOption((option) => 
            option
                .setName("track")
                .setDescription('enter track number given using queue command')
                .setRequired(true),
        );

export const slashHandler = async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const trackNumber = interaction.options.getString('track');
    const channel = interaction.channel as TextChannel;

    await interaction.deferReply();

    await remove(channel, trackNumber, interaction.guild!, interaction.followUp.bind(interaction) as ReplyFunction);
}

export const textHandler = async (message: Message, args: string[]) => {
    const trackNumber = args;
    const channel = message.channel as TextChannel;

    await remove(channel, trackNumber, message.guild!, message.reply.bind(message));
}

export default {data, slashHandler, textHandler}