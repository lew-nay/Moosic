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
const remove = (messageChannel, trackNumber, guild, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const queue = (0, discord_player_1.useQueue)(guild.id);
    const tracks = queue === null || queue === void 0 ? void 0 : queue.tracks.toArray();
    if (!queue || queue.isEmpty()) {
        return reply('Queue is empty.');
    }
    const track = tracks[trackNumber - 1];
    if (tracks.length < trackNumber || trackNumber <= 0) {
        return reply('Track not found.');
    }
    const removeEmbed = new discord_js_1.EmbedBuilder()
        .setTitle(track.title)
        .setAuthor({ name: 'Removed:' })
        .setThumbnail(track.thumbnail)
        .setDescription(track.author);
    yield reply({ embeds: [removeEmbed] });
    queue.removeTrack(trackNumber - 1);
});
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('remove')
    .setDescription('Removes chosen track')
    .addStringOption((option) => option
    .setName("track")
    .setDescription('enter track number given using queue command')
    .setRequired(true));
const slashHandler = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const trackNumber = interaction.options.getString('track');
    const channel = interaction.channel;
    yield interaction.deferReply();
    yield remove(channel, trackNumber, interaction.guild, interaction.followUp.bind(interaction));
});
exports.slashHandler = slashHandler;
const textHandler = (message, args) => __awaiter(void 0, void 0, void 0, function* () {
    const trackNumber = args;
    const channel = message.channel;
    yield remove(channel, trackNumber, message.guild, message.reply.bind(message));
});
exports.textHandler = textHandler;
exports.default = { data: exports.data, slashHandler: exports.slashHandler, textHandler: exports.textHandler };
//# sourceMappingURL=remove.js.map