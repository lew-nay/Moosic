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
import { isChatInputApplicationCommandInteraction } from "discord-api-types/utils/v10";

type ReplyFunction = typeof CommandInteraction.prototype.reply | Message['reply'];

const shuffleQueue = async(messageChannel: TextChannel | null, guild: Guild, reply: ReplyFunction) => {
    const queue = useQueue(guild.id);

    if (!queue || queue.isEmpty()){
        return reply('Queue is empty.');
    }

    queue.tracks.shuffle();

    await reply('Queue shuffled.')
}

export const slashHandler = async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const channel = interaction.channel as TextChannel;

    await interaction.deferReply();

    await shuffleQueue(channel, interaction.guild!, interaction.followUp.bind(interaction) as ReplyFunction);
}

export const textHandler = async(message: Message) => {
    const channel = message.channel as TextChannel;

    await shuffleQueue(channel, message.guild!, message.reply.bind(message));
}

export const data = new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Shuffles the current queue.');

export default {data, textHandler, slashHandler};