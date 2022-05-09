import Discord, { Client } from "discord.js";
import dotenv from "dotenv";
dotenv.config()
// let bot ready wrtie the msgs
const client = new Client({
    disableEveryone: true,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]
});

client.on("ready", () => {
    console.log(`${client.user.tag} is ready!`);
    client.user.setPresence({
        status: "online",
        activity: {
            name: "with my code",
            type: "WATCHING"
        }
    });
});

// make simple hello bot
client.on("messageCreate", async message => {
    console.log(message);
    if (message.author.bot) return;
    // snd ehl
    // if msg contain hi fury send reply
    if (message.content.toLowerCase().includes("hi")) {
        await message.channel.send("Hello");
    }


    // send dm to user
    if (message.content.toLowerCase().includes("dm")) {
        await message.author.send("Hello Master I am alive thank you");
    }

    if (message.content === "Hello") {
        message.channel.send("Hello!");
    }
    // snd bye
    if (message.content === "Bye") {
        message.channel.send("Bye!");
    }
}
);

client.login(process.env.DISCORD_BOT_TOKEN);