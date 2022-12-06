import { Client, GatewayIntentBits, IntentsBitField, Partials } from "discord.js";
import dotenv from "dotenv";
// import express from 'express';
import Twit from "twit";
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

const curentuser = {
    username: 'bradneuberg',
}


const T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    bearer_token: process.env.BEARER_TOKEN,
});
const client = new Client({
    disableEveryone: true,
    partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction, Partials.User],
    intents: [GatewayIntentBits.Guilds, IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
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

const aim = 6000;
const diff = 2;

/* get message */
/* on hi send hello */
client.on('messageCreate', async (msg) => {
    console.log("-----------------");
    if (msg.content === 'hi') {
        msg.reply('hello');
    }
    /* brad */
    if (msg.content === 'brad') {
        // every 80 seconds
        setInterval(() => {
            const params = {
                screen_name: curentuser.username,
            }
            T.get("users/show", params, (err, data, response) => {
                msg.reply(`${data.followers_count - diff} followers, aimed : ${aim}`);
                if (err) {
                    console.log(err);
                } else {
                    /* create follow if it is less than 1 */
                    if ((data.followers_count - diff) >= (aim - 1)) {
                        T.post("friendships/create", params, (err, data, response) => {
                            if (err) {
                                console.log(err);
                            } else {
                                // msg.reply(`followed ${curentuser.username}`);
                                console.log(data);
                            }
                        }
                        )
                    }
                    /* check if i am following him or not  */
                    if (data.followers_count == aim) {
                        T.get("friendships/show", params, (err, data, response) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(data);
                                if (data.relationship.source.following == true) {
                                    /* create tweet */
                                    const tweet = {
                                        status: `@${curentuser.username} I am following you now! 6000th follower!`,
                                    }
                                    T.post("statuses/update", tweet, (err, data, response) => {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            msg.reply(`tweeted ${tweet.status}`);
                                            console.log(data);
                                        }
                                    }
                                    )
                                }
                            }
                        }
                        )
                    }
                    if (data.followers_count < (aim - 2)) {
                        T.post("friendships/destroy", params, (err, data, response) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(data);
                            }
                        }
                        )
                    }
                    msg.reply(`Brad has ${(data.followers_count - diff)} followers`);
                }
            }
            )
        }, 60000 * 5);

    }
    /* leetcode */


}
);