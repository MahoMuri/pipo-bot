import { SlashCommandBuilder } from "@discordjs/builders";
import { Message, TextChannel } from "discord.js";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "start",
    data: new SlashCommandBuilder()
        .setName("start")
        .setDescription("Initial start of verification step"),
    description: "Initial start of verification step",
    category: "admin",
    adminOnly: true,
    usage: "/start",
    example: "/start",
    run: async (bot, interaction) => {
        const channel = <TextChannel>(
            await interaction.guild.channels.fetch(process.env.CHANNEL_ID)
        );
        const message = <Message>(
            await channel.messages.fetch(process.env.MESSAGE_ID)
        );

        if (!message.reactions.cache.hasAll("👨‍🎓", "🕵️‍♂️")) {
            await message.react("👨‍🎓");
            await message.react("🕵️‍♂️");
            interaction.reply({ content: "✅ Done!", ephemeral: true });
        } else {
            interaction.reply({
                content: "❌ Already reacted!",
                ephemeral: true,
            });
        }
    },
};
