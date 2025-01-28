import { type VoiceBasedChannel } from "discord.js";

// Adding this so that Typescript knows that the key is a string and the value is a VoiceBasedChannel
type MyVoiceChannels = {
    [key: string]: VoiceBasedChannel | undefined;
}

export const myVoiceChannels: MyVoiceChannels = {};
