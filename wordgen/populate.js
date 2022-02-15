// var nano = require('nano')('http://localhost:5984');
const fs = require('fs');
const readline = require('readline');
const _ = require('lodash');
const events = require('events');
const XRegExp = require('xregexp');
const unicodeWord = XRegExp("^\\pL+$");

const N = 100000;
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
            // console.log(`Line from file: ${line}`);
            const localFrequency = line.split(" ").reduce((acc, word) => {
                // console.log(acc, word);
                if (word.length == 5 && unicodeWord.test(word)) {
                    if (word in acc) {
                        acc[word]++
                    }
                    else {
                        acc[word] = 1
                    }
                }
                return acc;
            }, wordFrequency);

            // if (N == i) {
            //     rl.close();
            // }
        });

        await events.once(rl, 'close');

        const sorted = Object.fromEntries(
            Object.entries(wordFrequency).sort(([, a], [, b]) => b - a).slice(0, 12000)
        );

        // const sorted = Object.entries(wordFrequency).sort(([, a], [, b]) => b - a);



        console.log(sorted);

        let data = JSON.stringify(Object.keys(sorted), null, 2);
        fs.writeFileSync('./wordgen/words-' + new Date() + '.json', data);

        // console.log(sorted.slice(sorted.length / 40));


        console.log('Reading file line by line with readline done.');
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
    } catch (err) {
        console.error(err);
    }
})();

