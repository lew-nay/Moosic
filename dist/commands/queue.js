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
const TRACKS_PER_PAGE = 25;
const displayPageEmbed = (reply, page, queue) => __awaiter(void 0, void 0, void 0, function* () {
    const tracks = queue.tracks.toArray();
    const totalPages = (tracks.length / 25).toFixed(0);
    const pageTracks = tracks
        .slice(page * TRACKS_PER_PAGE, page * TRACKS_PER_PAGE + TRACKS_PER_PAGE)
        .filter(track => !!track); //filtering out null and undefineds
    const queueEmbed = new discord_js_1.EmbedBuilder()
        .setAuthor({ name: "Current queue:" });
    for (let i = 0; i < pageTracks.length; i++) {
        const track = pageTracks[i];
        const trackToAdd = `${track.title} - ${track.author}`;
        queueEmbed.addFields({ name: (i + 1 + (page * TRACKS_PER_PAGE)).toString(), value: trackToAdd });
    }
    const btnForward = new discord_js_1.ButtonBuilder()
        .setStyle(discord_js_1.ButtonStyle.Primary)
        .setCustomId('forwards')
        .setDisabled(page + 1 >= parseInt(totalPages))
        .setEmoji('➡');
    const btnBack = new discord_js_1.ButtonBuilder()
        .setStyle(discord_js_1.ButtonStyle.Primary)
        .setCustomId("backwards")
        .setDisabled(page - 1 < 0)
        .setEmoji("⬅");
    const btnPageNo = new discord_js_1.ButtonBuilder()
        .setStyle(discord_js_1.ButtonStyle.Secondary)
        .setCustomId("pagedisplay")
        .setDisabled(true)
        .setLabel(`${page + 1} / ${totalPages}`);
    const btnShuffle = new discord_js_1.ButtonBuilder()
        .setStyle(discord_js_1.ButtonStyle.Primary)
        .setCustomId("shuffle")
        .setLabel('🔀');
    const actionRow = new discord_js_1.ActionRowBuilder()
        .addComponents(btnBack, btnPageNo, btnForward, btnShuffle);
    const response = yield reply({ embeds: [queueEmbed], components: [actionRow] });
    try {
        const confirmation = yield response.awaitMessageComponent({ time: 120000 });
        // if (confirmation.customId === 'forwards') {
        // 	console.log('forwards');
        // 	await displayPageEmbed(async (params: any) => await confirmation.update(params), page+1, queue);
        // } 
        // else if (confirmation.customId === 'backwards') {
        // 	console.log('backwards');
        // 	await displayPageEmbed(async (params: any) => await confirmation.update(params), page-1, queue);
        // }
        switch (confirmation.customId) {
            case 'forwards':
                console.log('forwards');
                yield displayPageEmbed((params) => __awaiter(void 0, void 0, void 0, function* () { return yield confirmation.update(params); }), page + 1, queue);
                break;
            case 'backwards':
                console.log('backwards');
                yield displayPageEmbed((params) => __awaiter(void 0, void 0, void 0, function* () { return yield confirmation.update(params); }), page - 1, queue);
                break;
            case 'shuffle':
                console.log('shuffle');
                if (!queue || queue.isEmpty()) {
                    break;
                }
                queue.tracks.shuffle();
                yield displayPageEmbed((params) => __awaiter(void 0, void 0, void 0, function* () { return yield confirmation.update(params); }), page, queue);
                break;
        }
    }
    catch (err) {
        yield reply({ embeds: [queueEmbed], components: [] });
        console.log('timed out');
    }
});
const viewQueue = (messageChannel, guild, reply) => __awaiter(void 0, void 0, void 0, function* () {
    const queue = (0, discord_player_1.useQueue)(guild.id);
    if (!queue || queue.isEmpty()) {
        return reply("Queue is empty.");
    }
    yield displayPageEmbed(reply, 0, queue);
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