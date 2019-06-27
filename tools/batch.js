const _ = require('lodash');
const fs = require('fs-extra');

const wordsTxt = `
顺序 last next 数量 all any some both each either neither every few many much 指 代 this that these those another such

代词 I you he she we they it 疑问 代词 which who 冠词 a an the 感叹词 bye hello no yes pardon please wow damn 缩略词 Mr. Ms. 数词 zero one two three four five six seven eight nine ten hundred thousand million billion 
`

let result = wordsTxt.replace(/\n/g, ' ').replace(/([\u4e00-\u9fa5]+[\u4e00-\u9fa5\s]*[\u4e00-\u9fa5]+)/g, '\n$1');

result = result.split('\n').filter(item => item.trim()).map(item => item.trim());

result = result.map(item => {
    const group = item.match(/[\u4e00-\u9fa5]+[\u4e00-\u9fa5\s]*[\u4e00-\u9fa5]+/g)[0];
    return {
        group: '限定词-' + group.trim().replace(/\s+/g, ''),
        words: item.replace(group, '').split(' ').map(item => item.trim().replace(/[^a-zA-Z-]/g, '')).filter(item => item)
    }
    
})

console.log(result);
fs.writeFileSync('./temp.json', JSON.stringify(result, null, 2));

