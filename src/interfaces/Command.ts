import { CommandInteraction } from "discord.js";
import {
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import { Bot } from "../client";

interface Run {
    (bot: Bot, interaction: CommandInteraction);
}

export interface Command {
    name: string;
    data:
        | SlashCommandBuilder
        | SlashCommandSubcommandsOnlyBuilder
        | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    category: string;
    description: string;
    adminOnly: boolean;
    usage: string;
    example: string;
    placeholders?: string;
    run: Run;
}
