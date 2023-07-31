import { SlashCommandBuilder, Message, CacheType, ChatInputCommandInteraction } from "discord.js";
export declare const slashHandler: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>;
export declare const textHandler: (message: Message) => Promise<void>;
export declare const data: SlashCommandBuilder;
declare const _default: {
    data: SlashCommandBuilder;
    slashHandler: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>;
    textHandler: (message: Message<boolean>) => Promise<void>;
};
export default _default;
//# sourceMappingURL=clear.d.ts.map