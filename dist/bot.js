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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config_1 = require("./config");
const discord_js_1 = require("discord.js"); //classes capitalised
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
        discord_js_1.GatewayIntentBits.MessageContent // new privledge intent
    ],
});
const discord_player_1 = require("discord-player");
const player = new discord_player_1.Player(client);
const ping_1 = __importDefault(require("./commands/ping"));
const join_1 = __importDefault(require("./commands/join"));
const disconnect_1 = __importDefault(require("./commands/disconnect"));
const play_1 = __importDefault(require("./commands/play"));
const queue_1 = __importDefault(require("./commands/queue"));
const skip_1 = __importDefault(require("./commands/skip"));
const clear_1 = __importDefault(require("./commands/clear"));
const remove_1 = __importDefault(require("./commands/remove"));
const BOT_PREFIX = "+";
player.on("debug", (message) => __awaiter(void 0, void 0, void 0, function* () {
    // Emitted when the player sends debug info
    // Useful for seeing what dependencies, extractors, etc are loaded
    console.log(`General player debug event: ${message}`);
}));
player.events.on("debug", (queue, message) => __awaiter(void 0, void 0, void 0, function* () {
    // Emitted when the player queue sends debug info
    // Useful for seeing what state the current queue is at
    console.log(`Player debug event: ${message}`);
}));
player.events.on("playerStart", (queue, track) => __awaiter(void 0, void 0, void 0, function* () {
    const trackEmbed = new discord_js_1.EmbedBuilder()
        .setTitle(track.title)
        .setAuthor({ name: "Now playing:" })
        .setThumbnail(track.thumbnail)
        .setDescription(track.author);
    // @ts-ignore
    queue.metadata.send({ embeds: [trackEmbed] });
}));
client.on(discord_js_1.Events.MessageCreate, (message) => __awaiter(void 0, void 0, void 0, function* () {
    const content = message.content;
    if (!content.startsWith(BOT_PREFIX))
        return;
    // Splits the string by whitespace
    // first element will always be the "command name".
    // The rest will be the arguments to pass to the handler.
    const [commandType, ...restArgs] = content.split(/[ ]+/);
    // fetch the channel this came from to get the full channel 
    yield message.channel.fetch();
    console.log("commandType and restArgs together", commandType, restArgs);
    switch (commandType.toLowerCase()) {
        case `${BOT_PREFIX}join`:
            join_1.default.textHandler(message, restArgs);
            break;
        case `${BOT_PREFIX}disconnect`:
            disconnect_1.default.textHandler(message);
            break;
        case `${BOT_PREFIX}play`:
            play_1.default.textHandler(message, restArgs, player);
            break;
        case `${BOT_PREFIX}queue`:
            queue_1.default.textHandler(message);
            break;
        case `${BOT_PREFIX}skip`:
            skip_1.default.textHandler(message);
            break;
        case `${BOT_PREFIX}clear`:
            clear_1.default.textHandler(message);
            break;
        case `${BOT_PREFIX}remove`:
            remove_1.default.textHandler(message, restArgs);
            break;
        default:
            message.reply("Command not found");
            return;
    }
    ;
}));
//Events.InteractionCreate - static is better ;)
client.on(discord_js_1.Events.InteractionCreate, (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("interactCreateEvent", interaction);
    if (!interaction.isChatInputCommand())
        return;
    switch (interaction.commandName) {
        case "ping":
            ping_1.default.execute(interaction);
            break;
        case "join":
            join_1.default.slashHandler(interaction);
            break;
        case "disconnect":
            disconnect_1.default.slashHandler(interaction);
            break;
        case "play":
            play_1.default.slashHandler(interaction, player);
            break;
        case "queue":
            queue_1.default.slashHandler(interaction);
            break;
        case "skip":
            skip_1.default.slashHandler(interaction);
            break;
        case "clear":
            clear_1.default.slashHandler(interaction);
            break;
        case "remove":
            remove_1.default.slashHandler(interaction);
            break;
    }
}));
client.on(discord_js_1.Events.ClientReady, () => {
    var _a;
    console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}`);
});
client.login(config_1.botToken);
//# sourceMappingURL=bot.js.map