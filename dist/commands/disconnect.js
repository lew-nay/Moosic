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
const disconnect = (guild, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const channel = voiceChannels_1.myVoiceChannels[guild.id];
    const connection = (0, voice_1.getVoiceConnection)(channel.guild.id);
    connection === null || connection === void 0 ? void 0 : connection.destroy();
    yield reply(`Disconnecting from: **${channel.name}**.`);
    delete voiceChannels_1.myVoiceChannels[guild.id];
});
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("disconnect")
    .setDescription("Moosic disconnects from voice channel");
const slashHandler = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    yield disconnect(interaction.guild, interaction.reply.bind(interaction));
});
exports.slashHandler = slashHandler;
const textHandler = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const cachedChannel = message.guild.channels.cache.find(channel => { var _a; return (_a = channel.name) === null || _a === void 0 ? void 0 : _a.toLowerCase(); });
    if (!cachedChannel)
        return message.reply('Not connected to a channel.');
    yield disconnect(message.guild, message.reply.bind(message));
});
exports.textHandler = textHandler;
exports.default = { data: exports.data, slashHandler: exports.slashHandler, textHandler: exports.textHandler };
//# sourceMappingURL=disconnect.js.map