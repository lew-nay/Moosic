import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, Message } from 'discord.js';
export declare const data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
export declare const slashHandler: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>;
export declare const textHandler: (message: Message, args: string[]) => Promise<Message<boolean> | undefined>;
declare const _default: {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    slashHandler: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>;
    textHandler: (message: Message<boolean>, args: string[]) => Promise<Message<boolean> | undefined>;
};
export default _default;
//# sourceMappingURL=join.d.ts.map