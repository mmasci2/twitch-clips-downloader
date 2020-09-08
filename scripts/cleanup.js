const fs = require('fs');
const path = require('path');

/*
    Deletes old clips and empties text files
*/

module.exports = {
    emptyClips: () => {
        try {
           
            const dir = 'clips';
            fs.readdir(dir, (e, files) => {
                if(e) throw e;
        
                for(const file of files) {
                    if(file.match(/.mp4$/) || file.match(/.mkv$/)) {
                        fs.unlink(path.join(dir, file), e => {
                            if(e) throw e;
                        });
                    }
                }
             });

             fs.readdir('text', (e, files) => {
                if(e) throw e;
                for(const file of files){
                    fs.writeFile(`text/${file}`, '', (e) => {
                        if(e) throw e;
                    });
                }
             });
             
            fs.writeFile('clips/.txt', '', (e) => {
                if(e) throw e;
            });
            console.log('cleanup was a success');
        } catch (e) {
            throw e;
        }
    }
}