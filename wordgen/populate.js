// var nano = require('nano')('http://localhost:5984');
const fs = require('fs');
const readline = require('readline');
const _ = require('lodash');
const events = require('events');
const XRegExp = require('xregexp');
const unicodeWord = XRegExp("^\\pL+$");

const N = -1;
let i = 0;

const wordFrequency = {};

(async function processLineByLine() {
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream('./huwiki-20220201-pages-articles-multistream.xml'),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            i++;
            line.split(" ").reduce((acc, word) => {
                if (word.length == 5 &&
                    unicodeWord.test(word) &&
                    word == word.toLowerCase() &&
                    word != word.toUpperCase()) {
                    if (word in acc) {
                        acc[word]++
                    }
                    else {
                        acc[word] = 1
                    }
                }
                return acc;
            }, wordFrequency);

            if (N == i) {
                rl.close();
            }
        });

        await events.once(rl, 'close');

        // console.log('Closed file after line: ' + i);

        const sorted = Object.fromEntries(
            Object.entries(wordFrequency).sort(([, a], [, b]) => b - a).slice(0, 80000)
        );

        console.log(sorted)

        const keys = Object.keys(sorted);

        console.log("Sorted list contains: " + keys.length
            + " entries. Last frequency is: " + sorted[keys[keys.length - 1]]);


        let data = JSON.stringify(keys, null, 2);
        fs.writeFileSync('./wordgen/words-' + new Date() + '.json', data);

        console.log('Reading file line by line with readline done.');
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
    } catch (err) {
        console.error(err);
    }
})();

