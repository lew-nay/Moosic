import {
	SlashCommandBuilder,
	CommandInteraction,
	Channel,
	ChannelType,
} from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
import { myVoiceChannels } from "../voiceChannels";

export const data = new SlashCommandBuilder()
	.setName("disconnect")
	.setDescription("Moosic disconnects from voice channel");

export const execute = async (interaction) => {
	const channel = myVoiceChannels[interaction.guild.id];

	if (!channel) return interaction.reply("Not connected to a channel");

	const connection = getVoiceConnection(interaction.guild.id);
	connection?.destroy();

	await interaction.reply(`Disconnecting from: ${channel.name}`);
	delete myVoiceChannels[interaction.guild.id];
};

export default {data, execute}