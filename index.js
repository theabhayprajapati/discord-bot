import express from 'express';
const app = express();

const port = 3000;
// app.use(express.json());
app.use("/", (req, res)=>{
    res.json({
        message: "Hello World"
    })
})
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})