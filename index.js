import Discord from "discord.js";
import express from 'express';
const app = express();
console.log("Discord.js version: " + Discord.version + "\n" + Discord);
const port = 3000;
// app.use(express.json());
app.use("/", (req, res) => {
    res.json({
        message: "Hello World"
    })
})
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})