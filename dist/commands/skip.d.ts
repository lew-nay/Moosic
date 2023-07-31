import { SlashCommandBuilder, Message, CacheType, ChatInputCommandInteraction } from "discord.js";
export declare const data: SlashCommandBuilder;
export declare const slashHandler: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>;
export declare const textHandler: (message: Message) => Promise<void>;
declare const _default: {
    data: SlashCommandBuilder;
    slashHandler: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>;
    textHandler: (message: Message<boolean>) => Promise<void>;
};
export default _default;
//# sourceMappingURL=skip.d.ts.map