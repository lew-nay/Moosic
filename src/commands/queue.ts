import { SlashCommandBuilder } from "discord.js";
import { useQueue } from "discord-player";

export const data = new SlashCommandBuilder()
	.setName("queue")
	.setDescription("Shows currently enqueued songs");

export const execute = async (interaction) => {
	const queue = useQueue(interaction.guild.id);

	if (!queue || queue.isEmpty()) {
		return interaction.reply("Queue is empty");
	}

	const tracks = queue.tracks.toArray();

	let bareString = "Current queue: \n";

	for (let i = 0; i < tracks.length && bareString.length < 1900; i++) {
		const track = tracks[i];
		bareString += `[${i}] ${track.title} - ${track.author}\n`;
	}

	await interaction.reply(bareString);
};


export default {data, execute}