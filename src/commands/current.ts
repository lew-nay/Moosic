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
import { useQueue, GuildQueuePlayerNode } from "discord-player";

// defining the 'type' ChannelMap
type ChannelMap = {
    [key: string]: {
        voice: any;
        interval: {
            id: NodeJS.Timer,
            timeStarted: number,
            trackLength: string ,
        } | null;
    }
}

// creating an empty obj channelMap that is type ChannelMap
const channelMap: ChannelMap = {};

type ReplyFunction = typeof CommandInteraction.prototype.reply | Message['reply'];

const currentlyPlaying = async(MessageChannel: TextChannel | null, guild: Guild, reply: ReplyFunction) => {
    
    const embed = await createProgressEmbed(guild, reply);

    if (!embed) {
        console.log('panic')
        return;
    }

	// if there is no channel yet, add one with null values
    if (!channelMap[guild.id]) {
	    channelMap[guild.id] = {
		    interval: null,
		    voice: null,
	    }
    }

    setIntervalForChannel(guild, embed.song!.duration, embed.msg.edit.bind(embed.msg) as ReplyFunction);
}

function setIntervalForChannel(guild: Guild, trackLength: string, reply: ReplyFunction){
    const interval = channelMap[guild.id].interval;

    // If there is an interval, clear the previous, prevents more than one interval running per guild
    // i.e. /current called multiple times for performance
    if(!!interval) {
        clearInterval(interval.id);
        channelMap[guild.id].interval = null;
    }

    // Set a new interval
    channelMap[guild.id].interval = {
        timeStarted: Date.now(),
        id: setInterval(() => barUpdater(guild, reply), 1000),
        trackLength: trackLength,
    }
}

function barUpdater(guild: Guild, reply: ReplyFunction){
    const interval = channelMap[guild.id].interval;

    if (!interval || interval == null) {
        console.log('help'); //shouldn't happen tbh
        return;
    }

    const timePassed = Date.now() - interval.timeStarted
    const endTime = interval.timeStarted + parseInt(interval.trackLength)

    if (timePassed == endTime) {
        clearInterval(interval.id); // clears the "job" in node
        channelMap[guild.id].interval = null; 
        return;
    }

    createProgressEmbed(guild, reply);
}

async function createProgressEmbed(guild: Guild, reply: ReplyFunction){
    const queue = useQueue(guild.id);

    if (!queue){
        await reply("No song is currently playing.");
        return null;
    }

    const song = queue!.currentTrack;

    const guildQueue = new GuildQueuePlayerNode(queue!);

    const progressBar = guildQueue.createProgressBar() ?? "Progress bar failed."
    
    
    const currentEmbed = new EmbedBuilder()
    .setTitle(song!.title)
    .setAuthor({ name: 'Currently playing:'})
    .setThumbnail(song!.thumbnail)
    .setDescription(song!.author)
    .addFields({name: 'Time:', value: progressBar });

    const msg = await reply({embeds: [currentEmbed]});

    return { song, msg }
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
