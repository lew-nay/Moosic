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
const discord_player_1 = require("discord-player");
const skip = (messageChannel, guild, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const queue = (0, discord_player_1.useQueue)(guild.id);
    const track = queue === null || queue === void 0 ? void 0 : queue.currentTrack;
    queue === null || queue === void 0 ? void 0 : queue.node.skip();
    if (!track) {
        yield reply('No track currently playing.');
        return;
    }
    const skipEmbed = new discord_js_1.EmbedBuilder()
        .setTitle(track.title)
        .setAuthor({ name: 'Skipping:' })
        .setThumbnail(track.thumbnail)
        .setDescription(track.author);
    yield reply({ embeds: [skipEmbed] });
});
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips current song");
const slashHandler = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const channel = interaction.channel;
    yield interaction.deferReply();
    yield skip(channel, interaction.guild, interaction.followUp.bind(interaction));
});
exports.slashHandler = slashHandler;
const textHandler = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const channel = message.channel;
    yield skip(channel, message.guild, message.reply.bind(message));
});
exports.textHandler = textHandler;
exports.default = { data: exports.data, slashHandler: exports.slashHandler, textHandler: exports.textHandler };
//# sourceMappingURL=skip.js.map