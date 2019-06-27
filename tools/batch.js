const _ = require('lodash');
const fs = require('fs-extra');

const wordsTxt = `
`

let result = wordsTxt.replace(/\n/g, ' ').replace(/([\u4e00-\u9fa5]+[\u4e00-\u9fa5\s]*[\u4e00-\u9fa5]+)/g, '\n$1');

result = result.split('\n').filter(item => item.trim()).map(item => item.trim());

result = result.map(item => {
    const group = item.match(/[\u4e00-\u9fa5]+[\u4e00-\u9fa5\s]*[\u4e00-\u9fa5]+/g)[0];
    return {
        group: '动态属性-' + group.trim().replace(/\s+/g, ''),
        words: item.replace(group, '').split(' ').map(item => item.trim().replace(/[^a-zA-Z-]/g, '')).filter(item => item)
    }
    
})

console.log(result);
fs.writeFileSync('./temp.json', JSON.stringify(result, null, 2));

