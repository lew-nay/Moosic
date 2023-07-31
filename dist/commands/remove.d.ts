import { SlashCommandBuilder, Message, CacheType, ChatInputCommandInteraction } from "discord.js";
export declare const data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
export declare const slashHandler: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>;
export declare const textHandler: (message: Message, args: string[]) => Promise<void>;
declare const _default: {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    slashHandler: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>;
    textHandler: (message: Message<boolean>, args: string[]) => Promise<void>;
};
export default _default;
//# sourceMappingURL=remove.d.ts.map