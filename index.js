import Discord, { Client } from "discord.js";
import dotenv from "dotenv";
// import express from 'express';
import puppeteer from 'puppeteer';


import fetch from 'node-fetch';
// make a server with express
import express from 'express';
// import leetcode from './api/leetcode.js';
dotenv.config();

const app = express();
// app.use('/leetcode', leetcode);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    console.log(JSON.stringify({
        subject: "Leetcode Rank",
        status: "leetcode",
        color: "orange",

    }));

    res.json({
        subject: 'leetcode',
        status: '814,050',
        color: 'orange',
    })
})
// app.use('/leetcode', leetcode);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

// const app = express();
console.log("Discord.js version: " + Discord.version + "\n" + Discord);

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


    // if the msg start with HSC
    if (msg.content.startsWith('HSC')) {
        const cmdMsg = msg.content;
        const cmdAry = cmdMsg.split(" ")
        var name = cmdAry[1];
        var momName = cmdAry[2];
        const senderId = msg.author.id;
        console.log(`Seat no: ${name} : Mother Name: ${momName}`);
        msg.channel.send(`
        Hey, <@${senderId}> i have recevied your credientail find... result.
        `);
        const res = await getResult(name, momName);
        console.log(res);
        // ./static/screenshot.png send this phopto
        msg.channel.send({
            files: [`${res}`]
        }, "Here is your result");
    }
})

const getResult = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    await page.goto(`https://testservices.nic.in/result/mbhsc2022/mbhsc2022.htm`, {
        waitUntil: 'networkidle2'
    });

    // C M036921 ARUNA
    const seatNo = "M036921"
    const motherName = "ARUNA";
    await page.$eval('input[name=regno]', (el, value) => el.value = value, seatNo);
    await page.$eval('input[name=mname]', (el, value) => el.value = value, motherName);
    await page.click('input[type=submit]');
    console.log("moving to another page");
    // TAKE SCREEN SHOT
    await page.screenshot({
        path: './static/screenshot.png',
        fullPage: true,
        // ZOOM OUT 
        scale: 2
    });
    await browser.close();
    return './static/screenshot.png';
}
