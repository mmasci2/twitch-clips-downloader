const fs = require('fs');
const { getVideoDurationInSeconds } = require('get-video-duration');
const {execFileSync} = require('child_process');


/*
    Creates timestamps for each clip and writes it into
    description.txt
*/

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

function timestamp(seconds) {
    const date = new Date(0);
    date.setSeconds(seconds);
    const timeString = date.toISOString().substr(11, 8);
    return timeString;
} 

module.exports = {
    create: async () => {

        let descText = 'CREDITS\n\n';
        let ffmpegText = '';
        const creditText = fs.readFileSync('text/credit.txt', {encoding: 'utf-8'}).split('\n');
        
        let length = '00:00:00';
        let time = 0;
        
        const filenames = fs.readdirSync('clips');
        let clips = [];
        

        filenames.forEach(file => {
            if(file.match(/.mp4$/)){
                clips.push(file);
            }
        });
        
        clips = shuffle(clips);
        let mkv = '';
        
        for(let i = 0; i < clips.length; ++i){
            
            let streamer = '';
            const n = creditText.findIndex(a => a.includes(`${clips[i]}`));
            
            if(n > -1){
                streamer = creditText[n].split(',').pop();
            }
            mkv = clips[i].replace(/.mp4$/, '.mkv');
            descText += `${length} - ${streamer}\n\n`;

            execFileSync('ffmpeg.exe', ['-i', clips[i], '-vcodec', 'copy', '-acodec', 'copy', mkv], {cwd: './clips/'});
            ffmpegText += `file '${mkv}'\n`;
            console.log(`${clips[i]} has been converted to mkv`);
            
            time += await getVideoDurationInSeconds(`clips/${clips[i]}`)
                              .then((duration) => {return duration})
            length = timestamp(time);
            
        }
        
        fs.writeFileSync('text/description.txt', descText);
        console.log('description.txt has been written');
        fs.writeFileSync('clips/.txt', ffmpegText);
        console.log('.txt has been written');
        
        
    }
};