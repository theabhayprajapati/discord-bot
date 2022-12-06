import puppeteer from 'puppeteer';
// https://heroicons.com/
// got this
import * as fs from "fs";
import * as path from "path";

var allSVG = [];
// run puppeteer
const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();
await page.goto('https://heroicons.com/',
    { waitUntil: 'networkidle2' }
);

console.log("hello world")

// catch all svg tags from the page
// relative grid grid-cols-2 items-start gap-x-8 sm:gap-x-12 lg:gap-x-16 gap-y-4 sm:gap-y-8 max-w-10xl mx-auto pt-6 sm:pt-8 pb-12
// go inside this class and print the svg tags with thre name
// print all elemnt with tag svg
const svg = await page.evaluate(() => {
    const svg = document.querySelectorAll('svg');
    return svg;
}   
)
console.log(svg)
// allSVG = [];
// allSVG = svgTags;
// console.log(allSVG);

// // console.log(svgTags);
// for (let i = 0; i < 10; i++) {
//     console.log(svgTags[i]);
// }
// // make file and put this data
// fs.writeFileSync(path.join('./static/svg.json'), JSON.stringify(allSVG));

// // import {allSVG} from "./main.js"  
// // close
browser.close();
// export allSVG
