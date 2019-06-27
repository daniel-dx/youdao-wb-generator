const _ = require('lodash');
const fs = require('fs-extra');

const wordsTxt = `
特殊性 special regular 一致性 same different

普遍性 typical normal common general popular average particular own 重要性 serious causal important main formal professional 必要性 necessary 关联 性 free relative legal physical mental local native international cheap expensive separate public worth
`

let result = wordsTxt.replace(/\n/g, ' ').replace(/([\u4e00-\u9fa5]+[\u4e00-\u9fa5\s]*[\u4e00-\u9fa5]+)/g, '\n$1');

result = result.split('\n').filter(item => item.trim()).map(item => item.trim());

result = result.map(item => {
    const group = item.match(/[\u4e00-\u9fa5]+[\u4e00-\u9fa5\s]*[\u4e00-\u9fa5]+/g)[0];
    return {
        group: '事物关系形容词-' + group.trim().replace(/\s+/g, ''),
        words: item.replace(group, '').split(' ').map(item => item.trim().replace(/[^a-zA-Z-]/g, '')).filter(item => item)
    }
    
})

console.log(result);
fs.writeFileSync('./temp.json', JSON.stringify(result, null, 2));

