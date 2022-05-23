import Discord, { Client } from "discord.js";
import dotenv from "dotenv";
import express from 'express';
import fetch from 'node-fetch';
dotenv.config();
const app = express();
console.log("Discord.js version: " + Discord.version + "\n" + Discord);
const port = 3000;


const client = new Client({
    disableEveryone: true,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]
});

client.login(process.env.TOKEN);
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        status: 'online',
        activity: {
            name: 'with my code',
            type: 'WATCHING'
        }
    });
}
);

const suggestFood = async () => {
    const foodInfo = {
        name: '',
        image: '',
        sourceUrl: '',
        sourceVideoUrl: '',

        healthScore: '',
    };
    // parameter 
    const params = {
        apiKey: process.env.API_KEY,
        tags: "vegetarian"
    }
    const options = {
        method: 'GET'
    };
    const data = await fetch(`https://api.spoonacular.com/recipes/random?apiKey=${process.env.API_KEY}&tags=indian`, options);
    const json = await data.json();

    foodInfo.name = json.recipes[0].title;
    foodInfo.sourceUrl = json.recipes[0].sourceUrl;
    foodInfo.healthScore = json.recipes[0].healthScore;
    foodInfo.image = json.recipes[0].image;
    console.log(foodInfo);
    return foodInfo;
}
client.on('messageCreate', async (msg) => {
    if (msg.author.bot) return;
    console.log(msg.content[1])

    if (msg.content === '!hello') {
        msg.channel.send('Hello!');
    }
    // dm
    if (msg.content === "dm") {
        msg.author.send("Hello!");
    }
    // if msg = !food
    if (msg.content === '!food') {
        const food = await suggestFood();
        const sender = msg.author.username;
        // get sender id
        const senderId = msg.author.id;
        msg.channel.send(`
        <@${senderId}> 
        here have a try to, __*${food.name}*__ a **${food.area ? food.area : "tasty"}** recipe with health score of ${food.healthScore}.
        ${food.image}
        `
        );
    }
})
// app.use(express.json());
app.use("/", (req, res) => {
    res.json({
        message: "Hello World"
    })
})
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})