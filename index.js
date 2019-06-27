const axios = require('axios');
const cheerio = require('cheerio');
const xml = require('xml');
const _ = require('lodash');
const fs = require('fs-extra');
const words = require('./words');
const _cliProgress = require('cli-progress');

const bar1 = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);

function translateWord(word) {
  return axios
    .get(`http://dict.youdao.com/w/${word}/`, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    })
    .then(res => {
      const $ = cheerio.load(res.data);
      return $('#phrsListTab .trans-container ul').text();
    });
}

function toXML(wordsObj) {
  let importObj = {
    wordbook: wordsObj.map(wordItem => {
      return {
        item: [
          { word: wordItem.word },
          {
            trans: {
              _cdata: wordItem.paraphrase
            }
          },
          { tags: wordItem.group }
        ]
      };
    })
  };
  return xml(importObj, true);
}

async function translateGroup(groupItem) {
  const results = [];
  await groupItem.words.reduce((chain, word) => {
    return chain.then(() => {
      return translateWord(word).then(res => {
        results.push({
          word,
          paraphrase: res
        });
        return;
      });
    });
  }, Promise.resolve());
  return results;
}

async function translate(words) {
  bar1.start(words.length, 0);
  const results = [];
  await words.reduce((chain, groupItem) => {
    return chain.then(() => {
      return translateGroup(groupItem).then(res => {
        results.push({
          group: groupItem.group,
          words: res
        });
        bar1.update(results.length);
        return;
      });
    });
  }, Promise.resolve());
  return results;
}

async function main() {
  const results = await translate(words);
  let importObj = _.chain(results)
    .map(item => {
      item.words.forEach(word => (word.group = item.group));
      return item.words;
    })
    .flatten()
    .value();
  const importXML = toXML(importObj);
  fs.writeFileSync('./import.xml', importXML);
}

main();
