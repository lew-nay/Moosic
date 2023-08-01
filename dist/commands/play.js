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
const extractor_1 = require("@discord-player/extractor");
const voice_1 = require("@discordjs/voice");
const voiceChannels_1 = require("../voiceChannels");
const discord_player_1 = require("discord-player");
// im going  to remove message as arguement so errors can show where needs fix
const play = (channelToJoin, messageChannel, guild, reply, player, query, engine) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the bot is in a channel already in this guild
    if (!voiceChannels_1.myVoiceChannels[guild.id] || voiceChannels_1.myVoiceChannels[guild.id] !== channelToJoin) {
        if (!channelToJoin) {
            // error here "you are not in a channel etc".
            yield reply("You are not in a voice channel.");
            return;
        }
        const voiceConnection = (0, voice_1.joinVoiceChannel)({
            channelId: channelToJoin.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator, // this is just the guild.voiceAdapater
        });
        // yes! this one way, alternative is to use channelToJOin in the joinVoiceChannle function instead
        voiceChannels_1.myVoiceChannels[guild.id] = channelToJoin;
        // await reply(`Joining: ${channelToJoin.name}`);
    }
    yield player.extractors.loadDefault();
    try {
        const { track } = yield player.play(channelToJoin, query, {
            nodeOptions: {
                metadata: messageChannel,
                resampler: 3200,
            },
            searchEngine: engine,
            audioPlayerOptions: {
                transitionMode: true,
            },
        });
        const queue = (0, discord_player_1.useQueue)(guild.id);
        const tracks = queue === null || queue === void 0 ? void 0 : queue.tracks.toArray();
        let trackNumber;
        if (!queue || queue.isEmpty()) {
            trackNumber = 1;
        }
        else {
            trackNumber = tracks.length;
        }
        const playEmbed = new discord_js_1.EmbedBuilder()
            .setTitle(track.title)
            .setAuthor({ name: 'Enqueued:' })
            .setThumbnail(track.thumbnail)
            .setDescription(track.author)
            .addFields({ name: 'Queue position:', value: trackNumber.toString() });
        yield reply({ embeds: [playEmbed] });
    }
    catch (e) {
        yield reply(`Something went wrong: ${e}.`);
        console.log(e);
    }
});
const slashHandler = (interaction, player) => __awaiter(void 0, void 0, void 0, function* () {
    // message // non existent
    const query = interaction.options.getString("query");
    const engine = interaction.options.getString("engine");
    // our engine is string | null
    const member = interaction.member;
    const channel = member.voice.channel;
    const textChannel = interaction.channel;
    yield interaction.deferReply();
    yield play(channel, textChannel, interaction.guild, interaction.followUp.bind(interaction), player, query, engine !== null && engine !== void 0 ? engine : undefined);
});
exports.slashHandler = slashHandler;
const textHandler = (message, args, player) => __awaiter(void 0, void 0, void 0, function* () {
    const query = args.join();
    const channel = message.member.voice.channel;
    const textChannel = message.channel;
    yield play(channel, textChannel, message.guild, message.reply.bind(message), player, query);
});
exports.textHandler = textHandler;
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("play")
    .setDescription("Moosic will play audio")
    .addStringOption((option) => option
    .setName("query")
    .setDescription("search for a song")
    .setRequired(true))
    .addStringOption((option) => option
    .setName("engine")
    .setDescription("the platform to search on")
    .addChoices({
    name: "Youtube",
    value: `ext:${extractor_1.YoutubeExtractor.identifier}`,
}, {
    name: "Spotify",
    value: `ext:${extractor_1.SpotifyExtractor.identifier}`,
}, {
    name: "SoundCloud",
    value: `ext:${extractor_1.SoundCloudExtractor.identifier}`,
}));
exports.default = { data: exports.data, slashHandler: exports.slashHandler, textHandler: exports.textHandler };
//# sourceMappingURL=play.js.map