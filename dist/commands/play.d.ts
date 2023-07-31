import { SlashCommandBuilder, Message, CacheType, ChatInputCommandInteraction } from "discord.js";
export declare const slashHandler: (interaction: ChatInputCommandInteraction<CacheType>, player: any) => Promise<void>;
export declare const textHandler: (message: Message, args: string[], player: any) => Promise<void>;
export declare const data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
declare const _default: {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    slashHandler: (interaction: ChatInputCommandInteraction<CacheType>, player: any) => Promise<void>;
    textHandler: (message: Message<boolean>, args: string[], player: any) => Promise<void>;
};
export default _default;
//# sourceMappingURL=play.d.ts.map