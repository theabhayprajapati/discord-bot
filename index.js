import Discord, { Client } from "discord.js";
import dotenv from "dotenv";
import express from 'express';
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

// hello
client.on('messageCreate', msg => {
    if (msg.author.bot) return;
    if (msg.content === '!hello') {
        msg.channel.send('Hello!');
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