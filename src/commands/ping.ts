import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("ping")
	.setDescription("Replies with pong");
/**
 * @param {CommandInteraction} interaction
 */
export const execute = async (interaction) => {
	await interaction.reply("Pong");
};

export default {data, execute}