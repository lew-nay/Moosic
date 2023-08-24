import { 
	SlashCommandBuilder, 
	EmbedBuilder,
	Message,
	Guild,
	CacheType,
	CommandInteraction,
	ChatInputCommandInteraction,
	TextChannel,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle,
	} from "discord.js";
import { GuildQueue, useQueue } from "discord-player";

type ReplyFunction = typeof CommandInteraction.prototype.reply | Message['reply'];

const TRACKS_PER_PAGE = 25;

const displayPageEmbed = async (reply: ReplyFunction, page: number, queue: GuildQueue) => {
	const tracks = queue.tracks.toArray();
	const totalPages = (tracks.length / 25).toFixed(0)

	const pageTracks = tracks
		.slice(page * TRACKS_PER_PAGE, page * TRACKS_PER_PAGE + TRACKS_PER_PAGE)
		.filter(track => !!track) //filtering out null and undefineds


	const queueEmbed = new EmbedBuilder()
		.setAuthor({name: "Current queue:"})


	for (let i = 0; i < pageTracks.length; i++) {
		const track = pageTracks[i];
		const trackToAdd = `${track.title} - ${track.author}`;

		queueEmbed.addFields({name: (i+1 + (page * TRACKS_PER_PAGE)).toString(), value: trackToAdd})
	}

	const btnForward = new ButtonBuilder()
		.setStyle(ButtonStyle.Primary)
		.setCustomId('forwards')
		.setDisabled(page+1 >= parseInt(totalPages))
		.setEmoji('➡')
			
	const btnBack = new ButtonBuilder()
		.setStyle(ButtonStyle.Primary)
		.setCustomId("backwards")
		.setDisabled(page-1 < 0)
		.setEmoji("⬅")
	
	const btnPageNo = new ButtonBuilder()
		.setStyle(ButtonStyle.Secondary)
		.setCustomId("pagedisplay")
		.setDisabled(true)
		.setLabel(`${page + 1} / ${totalPages}`)
	
	const btnShuffle = new ButtonBuilder()
		.setStyle(ButtonStyle.Primary)
		.setCustomId("shuffle")
		.setLabel('🔀')

	const actionRow = new ActionRowBuilder()
		.addComponents(btnBack, btnPageNo, btnForward, btnShuffle);

	const response = await reply({embeds: [queueEmbed], components: [actionRow as any]});

	try { 
		const confirmation = await response.awaitMessageComponent({time: 120_000 });

		// if (confirmation.customId === 'forwards') {
		// 	console.log('forwards');
		// 	await displayPageEmbed(async (params: any) => await confirmation.update(params), page+1, queue);
		// } 
		// else if (confirmation.customId === 'backwards') {
		// 	console.log('backwards');
		// 	await displayPageEmbed(async (params: any) => await confirmation.update(params), page-1, queue);
		// }

		switch(confirmation.customId){
			case 'forwards':
				console.log('forwards');
				await displayPageEmbed(async (params: any) => await confirmation.update(params), page+1, queue);
				break;
			case 'backwards':
				console.log('backwards');
				await displayPageEmbed(async (params: any) => await confirmation.update(params), page-1, queue);
				break;
			case 'shuffle':
				console.log('shuffle');

				if (!queue || queue.isEmpty()){
        			break;
   				}

    			queue.tracks.shuffle();

    			await displayPageEmbed(async (params: any) => await confirmation.update(params), page, queue);
				break;
		}
	} catch (err) {
		await reply({ embeds: [queueEmbed], components: [] })
		console.log('timed out')
	}
}

const viewQueue =  async(messageChannel: TextChannel | null, guild: Guild, reply: ReplyFunction) => {
	const queue = useQueue(guild.id);

	if (!queue || queue.isEmpty()){
		return reply("Queue is empty.");
	}

	await displayPageEmbed(reply, 0, queue);
}

export const slashHandler = async (interaction: ChatInputCommandInteraction<CacheType>) => {
	const channel = interaction.channel as TextChannel;

	await interaction.deferReply();
	
	await viewQueue(channel, interaction.guild!, interaction.followUp.bind(interaction) as ReplyFunction);
}

export const textHandler = async (message: Message) => {
	const channel = message.channel as TextChannel;

	await viewQueue(channel, message.guild!, message.reply.bind(message));
}

export const data = new SlashCommandBuilder()
	.setName("queue")
	.setDescription("Shows currently enqueued songs");


export default {data, slashHandler, textHandler}