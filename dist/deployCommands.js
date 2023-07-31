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
const config_1 = require("./config");
const ping_1 = __importDefault(require("./commands/ping"));
const join_1 = __importDefault(require("./commands/join"));
const disconnect_1 = __importDefault(require("./commands/disconnect"));
const play_1 = __importDefault(require("./commands/play"));
const skip_1 = __importDefault(require("./commands/skip"));
const queue_1 = __importDefault(require("./commands/queue"));
const clear_1 = __importDefault(require("./commands/clear"));
const remove_1 = __importDefault(require("./commands/remove"));
const discord_js_1 = require("discord.js"); //classes capitalised
//sets up the slash commands
function setupCommands() {
    return __awaiter(this, void 0, void 0, function* () {
        const commands = [
            ping_1.default.data,
            join_1.default.data,
            disconnect_1.default.data,
            play_1.default.data,
            skip_1.default.data,
            queue_1.default.data,
            clear_1.default.data,
            remove_1.default.data,
        ];
        //idk what this actually does, was in the example, doesn't work without it
        const rest = new discord_js_1.REST({ version: "10" }).setToken(config_1.botToken);
        try {
            //checks that the / commands have actually loaded
            console.log("Started refreshing application (/) commands.");
            yield rest.put(discord_js_1.Routes.applicationCommands(config_1.clientId), {
                body: commands,
            });
            console.log("Successfully reloaded application (/) commands.");
        }
        catch (error) {
            console.error(error);
        }
    });
}
setupCommands();
//# sourceMappingURL=deployCommands.js.map