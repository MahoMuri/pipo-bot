import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../interfaces/Command";

export const command: Command = {
    name: "delete",
    data: new SlashCommandBuilder()
        .setName("delete")
        .setDescription("Deletes a verification channel")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The owner of the channel to delete ")
                .setRequired(true)
        ),
    category: "admin",
    description: "Deletes a verification channel",
    adminOnly: true,
    usage: "/delete",
    example: "/delete",
    run: async (bot, interaction) => {
        const user = interaction.options.getUser("user");
        const data = JSON.parse(await bot.redis.get(user.id));

        const textChannel = await interaction.guild.channels.fetch(
            data?.textChannelId
        );

        if (textChannel) {
            interaction.reply({ content: "⌛ Deleting, please wait..." });
            setTimeout(async () => {
                await textChannel.delete();
                await bot.redis.del(user.id);
            }, 5000);
        } else {
            interaction.reply({
                content: "❌ Not a valid channel",
                ephemeral: true,
            });
        }
    },
};
