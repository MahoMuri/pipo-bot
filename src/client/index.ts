import { Client, Collection, Intents } from "discord.js";
import { readdirSync } from "fs";
import path from "path";
import Redis from "ioredis";
import consola, { Consola } from "consola";
import { getBorderCharacters, table } from "table";
import { Command } from "../interfaces/Command";
import { Event } from "../interfaces/Events";
import { getEnvironmentConfiguration } from "../utils/Environment";
import { Colors } from "../interfaces/Colors";

export class Bot extends Client {
    public categories = readdirSync(path.join(__dirname, "..", "commands"));

    public commands: Collection<string, Command> = new Collection();

    public events: Collection<string, Event> = new Collection();

    public config = getEnvironmentConfiguration();

    public consola: Consola;

    public redis: Redis;

    public colors = Colors;

    // Constructor for intents
    constructor() {
        super({
            allowedMentions: {
                parse: ["users", "roles"],
            },
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                // Intents.FLAGS.GUILD_PRESENCES,
            ],
            partials: ["MESSAGE", "CHANNEL", "REACTION"],
        });
    }

    public async init() {
        await this.login(this.config.token);
        consola.wrapConsole();
        this.consola = consola.withScope(`@${this.user.username}｜`);

        this.redis = new Redis("redis://localhost", { enableReadyCheck: true });

        this.redis.on("ready", () =>
            this.consola.success("Connected to Redis")
        );

        // Command registry
        const cmdTable = [];
        const commandsPath = path.join(__dirname, "..", "commands");
        this.categories.forEach((dir) => {
            const commands = readdirSync(`${commandsPath}/${dir}`).filter(
                (file) => file.endsWith(".ts")
            );

            commands.forEach((file) => {
                try {
                    const {
                        command,
                    } = require(`${commandsPath}/${dir}/${file}`);
                    this.commands.set(command.name, command);
                    cmdTable.push([file, "Loaded"]);
                } catch (error) {
                    cmdTable.push([file, `${error.message}`]);
                }
            });
        });

        // Event registry
        const eventTable = [];
        const eventsPath = path.join(__dirname, "..", "events");
        readdirSync(eventsPath).forEach((file) => {
            try {
                const { event } = require(`${eventsPath}/${file}`);
                this.events.set(event.name, event);
                this.on(event.name, event.run.bind(null, this));

                eventTable.push([file, "Loaded"]);
            } catch (error) {
                eventTable.push([file, `${error.message}`]);
            }
        });
        this.consola.log(
            `${table(cmdTable, {
                border: getBorderCharacters("norc"),
                header: {
                    alignment: "center",
                    content: "Commands",
                },
            })}${table(eventTable, {
                border: getBorderCharacters("norc"),
                header: {
                    alignment: "center",
                    content: "Events",
                },
            })}`
        );
    }
}
