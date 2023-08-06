import { botToken, clientId } from "./config";
import joinImport from "./commands/join";
import disconnectImport from "./commands/disconnect";
import playImport from "./commands/play";
import skipImport from "./commands/skip";
import queueImport from "./commands/queue";
import clearImport from "./commands/clear";
import removeImport from "./commands/remove";
import shuffleImport from "./commands/shuffle";
import { REST, Routes } from "discord.js"; //classes capitalised

//sets up the slash commands
async function setupCommands() {
	const commands = [
		joinImport.data,
		disconnectImport.data,
		playImport.data,
		skipImport.data,
		queueImport.data,
		clearImport.data,
		removeImport.data,
		shuffleImport.data,
	];

	//idk what this actually does, was in the example, doesn't work without it
	const rest = new REST({ version: "10" }).setToken(botToken);

	try {
		//checks that the / commands have actually loaded
		console.log("Started refreshing application (/) commands.");

		await rest.put(Routes.applicationCommands(clientId), {
			body: commands,
		});

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(error);
	}
}

setupCommands();
