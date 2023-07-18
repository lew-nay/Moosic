import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { useQueue } from "discord-player";

export const data = new SlashCommandBuilder()
	.setName("clear")
	.setDescription("Clears the queue");

export const execute = async (interaction: CommandInteraction) => {
	const queue = useQueue(interaction.guild!.id);
   
    queue?.clear();

	await interaction.reply("Queue cleared");
};

export default {data, execute}
