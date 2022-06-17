import { MessageReaction, User } from "discord.js";
import { Bot } from "../client";
import { Event } from "../interfaces/Events";

export const event: Event = {
    name: "messageReactionRemove",
    run: async (bot: Bot, reaction: MessageReaction, user: User) => {
        if (reaction.message.id !== process.env.MESSAGE_ID) {
            return;
        }

        const member = await reaction.message.guild.members.fetch(user.id);

        switch (reaction.emoji.toString()) {
            case "👨‍🎓": // Student
                if (member.roles.cache.has(process.env.STUDENT_ROLE_ID)) {
                    member.roles.remove(process.env.STUDENT_ROLE_ID);
                }
                break;

            case "🕵️‍♂️": // Neighbor
                if (member.roles.cache.has(process.env.NEIGHBOR_ROLE_ID)) {
                    member.roles.remove(process.env.NEIGHBOR_ROLE_ID);
                }
                break;

            default:
                break;
        }
    },
};
