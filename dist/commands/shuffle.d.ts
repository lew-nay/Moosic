import { SlashCommandBuilder, Message, CacheType, ChatInputCommandInteraction } from "discord.js";
export declare const slashHandler: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>;
export declare const textHandler: (message: Message) => Promise<void>;
export declare const data: SlashCommandBuilder;
declare const _default: {
    data: SlashCommandBuilder;
    textHandler: (message: Message<boolean>) => Promise<void>;
    slashHandler: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>;
};
export default _default;
//# sourceMappingURL=shuffle.d.ts.map