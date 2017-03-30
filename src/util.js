let fs = require('fs')
let _ = require('lodash')
let cheerio = require('cheerio')

// 将html中 body>div中内容 存入path中，div中结构 >p span中的内容
let exportHtml = function (path, filename, html) {
  if (path && filename && html) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }
    console.log('write to ',path+'\\'+filename)
    let $ = cheerio.load(html)
    let file = path+'\\'+filename
    fs.writeFileSync(file,'')
    _.forEach($('div p'), (p) => {
      fs.appendFileSync(file, '\r'+$(p).find('span').text())
    })
  }
}

// 根据/document/JudgmentSearch 返回的json数据格式 {"list":[{"DocumentId":5194468,"AH":"（2016）浙0122执2742号"}]}
let extractDocID = function (data) {
  let list = data.list || []
  let set = new Set()
  var map = new Map();
  _.forEach(list, (v) => {
    set.add(v.DocumentId || -1)
    map.set(v.DocumentId || -1, v.AH)
  })
  return {list: [...set], map}
}

module.exports = {exportHtml,extractDocID}