const { SlashCommandBuilder, CommandInteraction } = require('discord.js');
 // so here, because its standlone file "interaction"
 // will be typed as "any" if you hover over it.
 // no type hints = no autocomplete but you can force js to
 // t
 // in typescript you can but in js you cant, but you can put comments like this
 //should i just put any then
 // now if you hover over, it gives correct type = autocompletes
module.exports = { 
    data: new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Replies with pong'),
    /**
     * @param {CommandInteraction} interaction
     */
    execute: async (interaction) => {
        await interaction.reply('pong from correct file');
    }
}
