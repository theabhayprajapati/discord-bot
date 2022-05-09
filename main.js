import Discord, { Client } from "discord.js";
import dotenv from "dotenv";
dotenv.config()
// let bot ready wrtie the msgs
client.login(process.env.DISCORD_BOT_TOKEN);

const client = new Client({
    disableEveryone: true,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]
});

client.on("ready", () => {
    console.log(`${client.user.tag} is ready!`);
});
