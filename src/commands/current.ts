import { 
	SlashCommandBuilder, 
	EmbedBuilder,
	Message,
	Guild,
	CacheType,
	CommandInteraction,
	ChatInputCommandInteraction,
	TextChannel,
    GuildMember,
	} from "discord.js";
import { useQueue, GuildQueuePlayerNode } from "discord-player";

type ReplyFunction = typeof CommandInteraction.prototype.reply | Message['reply'];

const currentlyPlaying = async(MessageChannel: TextChannel | null, guild: Guild, reply: ReplyFunction) => {
    const queue = useQueue(guild.id);

    if (!queue || queue.isEmpty()){
        return reply("No song is currently playing.");
    }

    const song = queue!.currentTrack;

    const guildQueue = new GuildQueuePlayerNode(queue!);

    reply(guildQueue.createProgressBar() ?? "Progress bar failed.");
}

export const slashHandler = async (interaction: ChatInputCommandInteraction<CacheType>, player) => {
    const textChannel = interaction.channel as TextChannel;

    await interaction.deferReply();

    await currentlyPlaying(textChannel, interaction.guild!, interaction.followUp.bind(interaction) as ReplyFunction);
}

export const textHandler = async (message: Message) => {
    const member = message.member!;
    const textChannel = message.channel as TextChannel;

    await currentlyPlaying(textChannel, member.guild!, message.reply.bind(message));
}

export const data = new SlashCommandBuilder()
    .setName("current")
    .setDescription("Displays information about the current song")

export default {data,slashHandler, textHandler}