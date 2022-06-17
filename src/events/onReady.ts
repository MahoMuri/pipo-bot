import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { readdirSync } from "fs";
import path from "path";
import { Bot } from "../client";
import { Event } from "../interfaces/Events";

export const event: Event = {
    name: "ready",
    run: async (bot: Bot) => {
        bot.consola.success(`${bot.user.username} is online`);

        // Slashcommand registry
        const commands = [];
        const clientId = bot.application.id;
        const hiddenCommands = ["sudo", "test"];

        bot.categories.forEach((dir) => {
            const commandFiles = readdirSync(
                path.resolve(`src/commands/${dir}`)
            ).filter((file) => file.endsWith(".ts"));
            commandFiles.forEach((file) => {
                const { command: cmd } = require(`../commands/${dir}/${file}`);
                if (bot.config.mode === "production") {
                    if (cmd.data && !hiddenCommands.includes(cmd.name)) {
                        commands.push(cmd.data.toJSON());
                    }
                    return;
                }
                if (cmd.data) {
                    commands.push(cmd.data.toJSON());
                }
            });
        });

        const TOKEN = bot.config.token;
        const rest = new REST({ version: "9" }).setToken(TOKEN);

        try {
            bot.consola.info("Started loading slash commands...");

            if (bot.config.mode === "production") {
                await rest.put(Routes.applicationCommands(clientId), {
                    body: commands,
                });
                bot.consola.info("==================================");
                bot.consola.success("Application slash commands loaded!");
                bot.consola.info("==================================");
            } else if (bot.config.mode === "development") {
                await rest.put(
                    Routes.applicationGuildCommands(
                        clientId,
                        process.env.GUILD
                    ),
                    {
                        body: commands,
                    }
                );
                bot.consola.info("============================");
                bot.consola.success("Guild slash commands loaded!");
                bot.consola.info("============================");
            }
        } catch (error) {
            bot.consola.error(error);
        }
    },
};
