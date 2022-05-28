import Discord, { Client } from "discord.js";
import dotenv from "dotenv";
// import express from 'express';

import fetch from 'node-fetch';
// make a server with express
import express from 'express';
// import leetcode from './api/leetcode.js';
dotenv.config();

const app = express();
// app.use('/leetcode', leetcode);
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.json({
        this: "this is leetcode api",
        leetcode: "https://leetcode.com/abhayprajapati",
        github: "https://github.com/theabhayprajapati",
        twitter: "https://twitter.com/abhayprajapati_"
    })
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

// const app = express();
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
        // if sender reply is yes send recipe
        const filter = (reaction, user) => {
            return ['✅'].includes(reaction.emoji.name) && user.id === senderId;
        }
        msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                console.log(collected.first());
                msg.channel.send(`
                <@${senderId}> 
                here is your recipe, __*${food.name}*__ a **${food.area ? food.area : "tasty"}** recipe with health score of ${food.healthScore}.
                ${food.image}
                `
                );
            }
            )
            .catch(collected => {
                console.log(collected.first());
                msg.channel.send(`
                <@${senderId}> 
                you didn't reply, here is your recipe, __*${food.name}*__ a **${food.area ? food.area : "tasty"}** recipe with health score of ${food.healthScore}.
                ${food.image}
                `
                );
            }
            )
    }
})
