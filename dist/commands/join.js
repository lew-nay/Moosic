"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.textHandler = exports.slashHandler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const voice_1 = require("@discordjs/voice");
const voiceChannels_1 = require("../voiceChannels");
// The base function and all the core logic that the handlers
// will fill in. This is not exported as it is not used "raw". (although it could be)
// Takes in a "reply" function that is used to reply, this could either be the interaction.reply function 
// or the channel that the "text" version was sent in.
const join = (channelToJoin, guild, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const voiceConnection = (0, voice_1.joinVoiceChannel)({
        channelId: channelToJoin.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
    });
    voiceChannels_1.myVoiceChannels[guild.id] = channelToJoin;
    console.log('myVoiceChannels', voiceChannels_1.myVoiceChannels);
    yield reply(`Joining: **${channelToJoin.name}**.`);
});
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('join')
    .setDescription('Moosic joins a voice channel')
    .addChannelOption(option => option
    .setName('channel')
    .setDescription('the channel to join') //gives the user the option of which voice channel to join
    .setRequired(true)
    .addChannelTypes(discord_js_1.ChannelType.GuildVoice));
const slashHandler = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const voiceChannel = interaction.options.getChannel('channel');
    // Must "bind" the message otherwise it crashes (don't know why).
    yield join(voiceChannel, interaction.guild, interaction.reply.bind(interaction));
});
exports.slashHandler = slashHandler;
const textHandler = (message, args) => __awaiter(void 0, void 0, void 0, function* () {
    const channelName = args[0];
    if (!channelName)
        return message.reply("Please enter a channel to join.");
    // Find a related channel by name and is voice in the guild cache.
    const cachedChannel = message.guild.channels.cache.find(channel => {
        var _a;
        return ((_a = channel.name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === (channelName === null || channelName === void 0 ? void 0 : channelName.toLowerCase())
            && channel.type === discord_js_1.ChannelType.GuildVoice;
    });
    if (!cachedChannel)
        return message.reply(`Channel ${channelName} not found.`);
    // Must "bind" the message otherwise it crashes (don't know why).
    yield join(cachedChannel, message.guild, message.reply.bind(message));
});
exports.textHandler = textHandler;
exports.default = { data: exports.data, slashHandler: exports.slashHandler, textHandler: exports.textHandler };
//# sourceMappingURL=join.js.map