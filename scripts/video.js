const {execFileSync} = require('child_process');

/*
    Uses ffmpeg to put all the clips together to make one 
    mp4 file called out.mp4
*/

module.exports = {
    
    create: () => {    
        execFileSync('ffmpeg.exe', ['-f', 'concat', '-i', '.txt', '-c', 'copy', 'out.mp4'], {cwd: `./clips/`})
    }
};