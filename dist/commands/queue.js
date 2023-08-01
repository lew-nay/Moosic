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
const viewQueue = (messageChannel, guild, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const queue = (0, discord_player_1.useQueue)(guild.id);
    if (!queue || queue.isEmpty()) {
        return reply("Queue is empty.");
    }
    const tracks = queue.tracks.toArray();
    let bareString = "Current queue: \n";
    for (let i = 0; i < 50 && i < tracks.length; i++) {
        const track = tracks[i];
        bareString += `**[${i + 1}]:** ${track.title} - ${track.author}\n`;
    }
    yield reply(bareString);
});
const slashHandler = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const channel = interaction.channel;
    yield interaction.deferReply();
    yield viewQueue(channel, interaction.guild, interaction.followUp.bind(interaction));
});
exports.slashHandler = slashHandler;
const textHandler = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const channel = message.channel;
    yield viewQueue(channel, message.guild, message.reply.bind(message));
});
exports.textHandler = textHandler;
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("queue")
    .setDescription("Shows currently enqueued songs");
exports.default = { data: exports.data, slashHandler: exports.slashHandler, textHandler: exports.textHandler };
//# sourceMappingURL=queue.js.map