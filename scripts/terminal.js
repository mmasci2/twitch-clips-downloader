const prompt = require('prompt-sync')({sigint: true});
const cleanup = require('./cleanup');
const twitch = require('./twitch');
const description = require('./description');
const video = require('./video');

/*
    Command line interface to execute different functions
*/

const games = [
    {gameTitle: 'Brawlhalla', url: 'https://www.twitch.tv/directory/game/Brawlhalla/clips?range=24hr'},
    {gameTitle: 'Fall Guys', url: 'https://www.twitch.tv/directory/game/Fall%20Guys/clips?range=24hr'},
    {gameTitle: 'Dragon Ball FighterZ', url: 'https://www.twitch.tv/directory/game/Dragon%20Ball%20FighterZ/clips?range=24hr'}
];


async function downloadClips() {
    games.forEach((el, i) => {
        console.log(`${i}. ${el.gameTitle}`);
    });
    let i = prompt('> ');
    i = parseInt(i);
    if(i >= 0 && i < games.length){
        cleanup.emptyClips();
        await twitch.scrape(games[i]);
    }
}



module.exports = {
    start: async () => {
        try {
            let loop = true;
            process.stdout.write("\u001b[2J\u001b[0;0H");
            
            while(loop){
                console.log(
                    '\n1. Download Clips'+
                    '\n2. Create Description'+
                    '\n3. Create out.mp4'+
                    '\n0. Exit\n'
                );
                const option = prompt('> ');
                switch(option) {
                    case '1':
                        await downloadClips();
                        break;
                    case '2':
                        await description.create();
                        break;
                    case '3':
                        video.create();
                        break;
                    case '0':
                    default:
                        loop = false;
                }
            }
            process.stdout.write("\u001b[2J\u001b[0;0H");

        } catch (e) {
            throw e;
        }
    }
};