import { SlashCommandBuilder, Message, ChatInputCommandInteraction, CacheType } from "discord.js";
export declare const data: SlashCommandBuilder;
export declare const slashHandler: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>;
export declare const textHandler: (message: Message) => Promise<Message<boolean> | undefined>;
declare const _default: {
    data: SlashCommandBuilder;
    slashHandler: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>;
    textHandler: (message: Message<boolean>) => Promise<Message<boolean> | undefined>;
};
export default _default;
//# sourceMappingURL=disconnect.d.ts.map