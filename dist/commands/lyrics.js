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
const extractor_1 = require("@discord-player/extractor");
const lyrics = (channel, messageChannel, guild, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const queue = (0, discord_player_1.useQueue)(guild.id);
    const currentTrack = queue.currentTrack;
    const lyricsFinder = (0, extractor_1.lyricsExtractor)();
    if (!currentTrack) {
        return reply('No song is currently playing.');
    }
    const currentTrackString = currentTrack.toString();
    console.log('song name: ' + currentTrackString);
    const lyrics = yield lyricsFinder.search(currentTrack.toString()).catch(() => null);
    //await deferReply();
    if (!lyrics) {
        return reply("Lyrics not found.");
    }
    const CHARS_PER_PAGE = 4096;
    const pages = (lyrics.lyrics.length / CHARS_PER_PAGE).toFixed(0);
    const totalPages = parseInt(pages);
    console.log('pages:' + totalPages);
    for (let i = 0; i < parseInt(pages); i++) {
        let j = i * 4096;
        const trimmedLyrics = lyrics.lyrics.substring(j, j + 4096);
        //await reply(trimmedLyrics);
        const lyricsEmbed = new discord_js_1.EmbedBuilder()
            .setTitle(lyrics.title)
            .setAuthor({ name: lyrics.artist.name })
            .setThumbnail(lyrics.thumbnail)
            .setDescription(trimmedLyrics);
        yield reply({ embeds: [lyricsEmbed] });
    }
});
const slashHandler = (interaction, player) => __awaiter(void 0, void 0, void 0, function* () {
    const member = interaction.member;
    const channel = member.voice.channel;
    const textChannel = interaction.channel;
    yield interaction.deferReply();
    yield lyrics(channel, textChannel, interaction.guild, interaction.followUp.bind(interaction));
});
exports.slashHandler = slashHandler;
const textHandler = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const member = message.member;
    const channel = message.member.voice.channel;
    const textChannel = message.channel;
    yield lyrics(channel, textChannel, member.guild, message.reply.bind(message));
});
exports.textHandler = textHandler;
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("lyrics")
    .setDescription('Displys the lyrics of the current song');
exports.default = { data: exports.data, slashHandler: exports.slashHandler, textHandler: exports.textHandler };
//# sourceMappingURL=lyrics.js.map