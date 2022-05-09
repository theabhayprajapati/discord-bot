import Discord, { Client } from "discord.js";
import dotenv from "dotenv";
import fetch from "node-fetch";
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

const AiMageAPI = async () => {
    let headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json"
    }

    let bodyContent = JSON.stringify({ "Id": "7502889418978", "tags": ["applique", "bag", "bead", "belt", "blouse", "bow", "cape", "coat", "collar", "dress", "epaulette", "flower", "glasses", "hair accessory", "head covering", "headband", "jacket", "lapel", "neckline", "pants", "pocket", "ribbon"], "shopName": "wethekoolive.myshopify.com" });

    fetch("https://yrpaxzdyg6.execute-api.us-west-2.amazonaws.com/prod", {
        method: "POST",
        body: bodyContent,
        headers: headersList
    }).then(function (response) {
        return response.text();
    }).then(function (data) {
        console.log(data);
    })
}
// make simple hello bot
client.on("messageCreate", async message => {
    console.log(message);
    if (message.author.bot) return;
    // snd ehl
    // if msg contain hi fury send reply
    if (message.content.toLowerCase().includes("hi")) {
        await message.channel.send("Hello");
    }

    // if msg contain fetch 
    if (message.content.toLowerCase().includes("fetch")) {
        const data = await AiMageAPI()
        await message.channel.send("Fetching...")
        // await message.channel.send(data.body);
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