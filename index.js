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
        calories: '',
        fat: '',
        image: '',
        sourceUrl: '',
        sourceVideoUrl: '',
        category: '',
        location: '',
    }
    const url = 'https://www.themealdb.com/api/json/v1/1/random.php';
    const food = await fetch(url);
    const data = await food.json();
    const foodData = data.meals[0];
    foodInfo.name = foodData.strMeal;
    foodInfo.category = foodData.strCategory;
    foodInfo.area = foodData.strArea;
    foodInfo.image = foodData.strMealThumb;
    foodInfo.sourceUrl = foodData.strSource;
    foodInfo.sourceVideoUrl = foodData.strYoutube;
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
        msg.channel.send(`
        @${sender} here have a try to **${food.name}**, from **${food.area}** in **${food.category}**.
        ${food.image}
        `
        );
        // if reply is yes then send video and source
        const filter = msg => msg.author.id === msg.author.id;
        const collector = msg.channel.createMessageCollector(filter, { time: 60000 });
        collector.on('collect', async (message) => {
            if (message.content === 'yes' || message.content === 'y') {
                msg.channel.send(`
                check the video: ${food.sourceVideoUrl} recipe}`) 
            }
            if (message.content === 'no' || message.content === 'n') {
                // mention the sender
                
                msg.channel.send(`
                finding new food..`)
                const sender = msg.author.username;
                msg.channel.send(`
                @${sender} here have a try to **${food.name}**, from **${food.area}** in **${food.category}**.
                ${food.image}
                `
                )
            }
        }

        );
        // if msg is stop then stop
        const filter2 = msg => msg.author.id === msg.author.id;
        const collector2 = msg.channel.createMessageCollector(filter2, { time: 60000 });
        collector2.on('collect', async (message) => {
            if (message.content === 'stop') {
                collector.stop();
                collector2.stop();
            }
        }
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