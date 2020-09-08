const terminal = require('./scripts/terminal');

async function main() {
    try {
        terminal.start();
    } catch (e) {
        console.log(e.message);
    }
}

main();