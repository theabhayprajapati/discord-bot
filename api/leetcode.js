// make a server with express
import express from 'express';
import puppeteer from 'puppeteer';
// router
const router = express.Router();

router.get('/', async (req, res) => {
    const rank = await getPageData();
    //  ass title to endpoint

    try {
        res.json({
            icon: "leetcode",
            subject: "Leetcode Rank",
            color: "orange",
            rank: rank
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("error");
    }
})
// export this router
const getPageData = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();
    await page.goto(`https://leetcode.com/abhayprajapati`, {
        waitUntil: 'networkidle2'
    });
    // get text of this class .ttext-label-1 dark:text-dark-label-1 font-medium
    const text4 = await page.$eval('.ttext-label-1', el => el.textContent);
    console.log(text4);
    await browser.close();
    return text4;
}
export default router;
