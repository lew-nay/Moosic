import { SlashCommandBuilder } from "discord.js";
import { useQueue } from "discord-player";

export const data = new SlashCommandBuilder()
	.setName("skip")
	.setDescription("Skips current song");

export const execute = async (interaction) => {
	const queue = useQueue(interaction.guild.id);
	const track = queue?.currentTrack;
	queue?.node.skip();
    
    if (!track) {
        await interaction.reply(`No track currently playing`);
        return;
    }

	await interaction.reply(`Skipping ${track.title} - ${track.author}`);
};

export default {data, execute}