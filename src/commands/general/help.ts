import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "help",
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("The help command"),
    description: "The help command",
    category: "general",
    adminOnly: false,
    usage: "/help",
    example: `/help`,
    run: async (bot, interaction) => {
        bot.consola.success("Help command works!");
    },
};
