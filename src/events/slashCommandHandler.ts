import { Interaction, MessageEmbed } from "discord.js";
import { Bot } from "../client";
import { Event } from "../interfaces/Events";

export const event: Event = {
    name: "interactionCreate",
    run: async (bot: Bot, interaction: Interaction) => {
        if (!interaction.isCommand()) {
            return;
        }

        const command = bot.commands.get(interaction.commandName);

        if (command) {
            // let guildConfig = await GuildModel.findOne({
            //     guildId: interaction.guildId,
            // });

            // if (!guildConfig) {
            //     guildConfig = await GuildModel.create({
            //         guildId: interaction.guildId,
            //     });
            // }

            if (command.adminOnly) {
                if (
                    !interaction.memberPermissions.has("ADMINISTRATOR") ||
                    !interaction.memberPermissions.has("MANAGE_GUILD")
                ) {
                    const embed = new MessageEmbed()
                        .setColor(bot.colors.UPSDELL_RED)
                        .setDescription(
                            "❌ **You don't have access to run this command**!"
                        );
                    interaction.reply({
                        embeds: [embed],
                        ephemeral: true,
                    });
                    return;
                }
            }

            command.run(bot, interaction);
        }
    },
};
