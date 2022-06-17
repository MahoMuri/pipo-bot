import { stripIndents } from "common-tags";
import { MessageEmbed, MessageReaction, User } from "discord.js";
import { Bot } from "../client";
import { Event } from "../interfaces/Events";

export const event: Event = {
    name: "messageReactionAdd",
    run: async (bot: Bot, reaction: MessageReaction, user: User) => {
        if (reaction.message.id !== process.env.MESSAGE_ID) {
            return;
        }

        if (reaction.emoji.toString() === "👨‍🎓") {
            const member = await reaction.message.guild.members.fetch(user.id);
            if (member.roles.cache.has(process.env.ROLE_ID)) {
                return;
            }

            let data = JSON.parse(await bot.redis.get(user.id));
            if (!data) {
                const textChannel =
                    await reaction.message.guild.channels.create(
                        `${user.username}-verification`,
                        {
                            parent: process.env.PARENT_ID,
                            permissionOverwrites: [
                                {
                                    id: reaction.message.guild.roles.everyone,
                                    deny: "VIEW_CHANNEL",
                                },
                                {
                                    id: user.id,
                                    allow: "VIEW_CHANNEL",
                                },
                            ],
                        }
                    );

                const embed = new MessageEmbed()
                    .setTitle(`Welcome to ${reaction.message.guild.name}!`)
                    .setDescription(
                        stripIndents`Hello ${user}, Welcome to your verification channel! Kindly wait for the admins to talk to you here to get fully verified!`
                    );
                textChannel.send({ content: user.toString(), embeds: [embed] });
                data = {
                    textChannelId: textChannel.id,
                };
                bot.redis.set(user.id, JSON.stringify(data));
            }
        }
    },
};
