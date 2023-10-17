import { 
	SlashCommandBuilder, 
	EmbedBuilder,
	Message,
	Guild,
	CacheType,
	CommandInteraction,
	ChatInputCommandInteraction,
	TextChannel,
    TextInputComponent,
	} from "discord.js";
import { useQueue, GuildQueuePlayerNode } from "discord-player";

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

const channelMap: ChannelMap = {};

type ReplyFunction = typeof CommandInteraction.prototype.reply | Message['reply'];

const currentlyPlaying = async(MessageChannel: TextChannel | null, guild: Guild, reply: ReplyFunction) => {
    // const queue = useQueue(guild.id);

    // if (!queue){
    //     return reply("No song is currently playing.");
    // }

    // const song = queue!.currentTrack;

    // const guildQueue = new GuildQueuePlayerNode(queue!);

    // const progressBar = guildQueue.createProgressBar() ?? "Progress bar failed."
    
    
    // const currentEmbed = new EmbedBuilder()
    // .setTitle(song!.title)
    // .setAuthor({ name: 'Currently playing:'})
    // .setThumbnail(song!.thumbnail)
    // .setDescription(song!.author)
    // .addFields({name: 'Time:', value: progressBar });
    
    // reply({embeds: [currentEmbed]}); // include this in func too i think
    
    const embed = await createProgressEmbed(guild, reply);

    if (!embed) {
        console.log('panic')
        return;
    }

    // do we not need to get the song length to know when to end the interval
    // channelMap[guild.id].interval.trackLength = song!.duration;
    setIntervalForChannel(guild, embed.song!.duration, embed.msg.edit as ReplyFunction);
}

// lets focus on this first
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
    // now you can use local interval instead of channel map
    const interval = channelMap[guild.id].interval;

    if (!interval) {
        console.log('help'); //shouldn't happen tbh
        return;
    }

    const timePassed = Date.now() - interval.timeStarted
    const endTime = interval.timeStarted + parseInt(interval.trackLength)

    if (timePassed > endTime) {
        clearInterval(interval.id); // clears the "job" in node
        channelMap[guild.id].interval = null; // null not happy because the "type" says it can't be null
        return;
    }

    // TODO: do the actual update here
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