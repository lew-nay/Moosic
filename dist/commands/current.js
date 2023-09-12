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
exports.data = exports.textHandler = exports.slashHandler = void 0;
const discord_js_1 = require("discord.js");
const discord_player_1 = require("discord-player");
const currentlyPlaying = (MessageChannel, guild, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const queue = (0, discord_player_1.useQueue)(guild.id);
    if (!queue || queue.isEmpty()) {
        return reply("No song is currently playing.");
    }
    const song = queue.currentTrack;
    const guildQueue = new discord_player_1.GuildQueuePlayerNode(queue);
    reply((_a = guildQueue.createProgressBar()) !== null && _a !== void 0 ? _a : "Progress bar failed.");
});
const slashHandler = (interaction, player) => __awaiter(void 0, void 0, void 0, function* () {
    const textChannel = interaction.channel;
    yield interaction.deferReply();
    yield currentlyPlaying(textChannel, interaction.guild, interaction.followUp.bind(interaction));
});
exports.slashHandler = slashHandler;
const textHandler = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const member = message.member;
    const textChannel = message.channel;
    yield currentlyPlaying(textChannel, member.guild, message.reply.bind(message));
});
exports.textHandler = textHandler;
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("current")
    .setDescription("Displays information about the current song");
exports.default = { data: exports.data, slashHandler: exports.slashHandler, textHandler: exports.textHandler };
//# sourceMappingURL=current.js.map