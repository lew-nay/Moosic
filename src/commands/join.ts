import { 
        SlashCommandBuilder, 
        ChannelType, 
        CommandInteraction,  
        VoiceChannel, 
        ChatInputCommandInteraction, 
        CacheType, 
        Guild, 
        Message 
    } from 'discord.js';
import { getVoiceConnection, joinVoiceChannel } from '@discordjs/voice';
import { myVoiceChannels } from '../voiceChannels';
import { useMainPlayer } from 'discord-player';

// We use the internal reply function of the interaction to type the replyFunction correctly.
// This means our version can also accept embeds, options etc.
type ReplyFunction = typeof CommandInteraction.prototype.reply | Message['reply'];

// The base function and all the core logic that the handlers
// will fill in. This is not exported as it is not used "raw". (although it could be)
// Takes in a "reply" function that is used to reply, this could either be the interaction.reply function 
// or the channel that the "text" version was sent in.
const join = async (channelToJoin: VoiceChannel, guild: Guild, reply: ReplyFunction) => {

    // If the channel is the same as the current one, skip.
    const currentConnection = getVoiceConnection(guild.id);

    if (currentConnection?.joinConfig.channelId === channelToJoin.id) 
        return void await reply(`Bot is already in channel ${channelToJoin.name}`);
    
    // re-play the queue? 
    const player = useMainPlayer();
    const currentQueue = player.queues.get(guild.id);

    myVoiceChannels[guild.id] = channelToJoin;

    if (!currentQueue) {
        const voiceConnection = joinVoiceChannel({
            channelId: channelToJoin.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        });
        return void await reply(`Joining: **${channelToJoin.name}**. Waiting for songs.`);;
    }

    currentQueue.connect(channelToJoin);

    await reply(`Joining: **${channelToJoin.name}**. Resuming songs.`);
}

export const data = new SlashCommandBuilder()
    .setName('join')
    .setDescription('Moosic joins a voice channel')
    .addChannelOption(option => 
        option
        .setName('channel')
        .setDescription('the channel to join') //gives the user the option of which voice channel to join
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildVoice));

export const slashHandler = async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const voiceChannel = interaction.options.getChannel('channel') as VoiceChannel;
    
    // Must "bind" the message otherwise it crashes (don't know why).
    await join(voiceChannel, interaction.guild!, interaction.reply.bind(interaction));
}

export const textHandler = async (message: Message, args: string[]) => {
    const channelName = args[0];

    if (!channelName) return message.reply("Please enter a channel to join.");

    // Find a related channel by name and is voice in the guild cache.
    const cachedChannel = message.guild!.channels.cache.find(channel => channel.name?.toLowerCase() === channelName?.toLowerCase() 
        && channel.type === ChannelType.GuildVoice);

    if (!cachedChannel) return message.reply(`Channel ${channelName} not found.`);

    // Must "bind" the message otherwise it crashes (don't know why).
    await join(cachedChannel as VoiceChannel, message.guild!, message.reply.bind(message));
}

export default { data, slashHandler, textHandler }