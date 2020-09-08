const puppeteer = require('puppeteer');
const https = require('https');
const fs = require('fs');

/* 
    Uses puppeteer to scrape clips from twitch.tv 
    and credits the streamer in credit.txt
*/

const download = (clip, i) => new Promise((resolve, reject) => {
        
    let dest = i + '.mp4';
    const file = fs.createWriteStream(`clips/${dest}`);
    
    https.get(clip, res => {
        res.pipe(file);

        file.on('finish', () => {
            file.close(resolve(true));
        });
    }).on('error', e => {
        fs.unlink(dest);
        reject(e.message);
    
    }); 
});



module.exports = {

    scrape: async (ptr) => {

        try {

            const browser = await puppeteer.launch({
                headless: false
            });


            const page = await browser.newPage();
            
            await page.goto(ptr.url, { waitUntil: 'networkidle2'});
            const selector = 'h1[class="tw-bold tw-font-size-2 tw-line-height-heading tw-title"]';
            await page.waitForSelector(selector);
            await page.click(selector);
            
            for(let i = 0; i < 40; ++i){
               await page.keyboard.press('ArrowDown');
               await page.waitFor(100);
            }

            
           const streamerNames = await page.evaluate(() => {
                return Array.from(document.
                    querySelectorAll('div[class="tw-mg-b-2"] a[data-a-target="preview-card-channel-link"]'))
                    .map(el => el.innerText);
            });

            const clips = await page.evaluate(() => {
                return Array.from(document.
                    querySelectorAll('div[class="tw-mg-b-2"] img[class="tw-image"]')).
                    map(el => el.src);
            });
            
            await browser.close();
            
            let result;
            let creditText = '';
            for(let i = 0; i < clips.length; ++i){
                clips[i] = clips[i].split('-preview')[0];
                clips[i] = clips[i] + '.mp4';
                result = await download(clips[i], i);

                if(result) {
                    console.log(`Success: ${clips[i]} was downloaded`);
                    creditText += `${i}.mp4,https://www.twitch.tv/${streamerNames[i]}\n`;
                } else {
                    console.log(`Error: ${clips[i]} was not downloaded`);
                    console.error(result);
                }
            }
            const tagText = `${ptr.gameTitle},${ptr.gameTitle} Highlights,${ptr.gameTitle} Community Highlights`;
            fs.writeFileSync('text/tag.txt', tagText);
            console.log('tag.txt has been written');

            const dateObj = new Date();
            const month = dateObj.getUTCMonth() + 1;
            const day = dateObj.getUTCDate();
            const year = dateObj.getUTCFullYear();
            const newDate = `${year}/${month}/${day}`;
            fs.writeFileSync('text/title.txt', `${ptr.gameTitle} Highlights ${newDate}`);
            console.log('title.txt has been written');

            fs.writeFileSync('text/credit.txt', creditText);
            console.log('credit.txt has been written');
            
            
        } catch(e) {
            throw e;
        }
        
    }
};



