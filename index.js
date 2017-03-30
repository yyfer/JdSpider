// inset
let fs = require('fs')
let EventProcy = require('eventproxy')
// local
let jdSpider = require('./src/jdSpider')
let config = require('./src/config')

// init
let pageno = 1
let list = []
let index = 0
let map = {}

let getContent = function () {
  if (index < list.length) {
    let ep = new EventProcy()
    ep.after('next', 10, () => {
      getContent()
    })
    for (let j=0,i=index;(j < 10 && i<list.length);j++,i++,index++) {
      jdSpider.extractDetail(list[i], map.get(list[i])).then((path) => {
        jdSpider.extractContent(map.get(list[i]), path).then((v) => {
          ep.emit('next')
        },(e)=>{
          ep.emit('next')
        })
      }, (e) => {
        ep.emit('next')
      })
    }
  } else {
    run(++pageno)
  }
}

let run = function (pageno) {
  // mkdir /dist
  if (!fs.existsSync(config.dist.path)) {
    fs.mkdirSync(config.dist.path)
  }
  // pageno
  if (pageno * config.folderContains <= config.total){
    jdSpider.search(pageno).then((data)=>{
      list = data.list
      index = 0
      map = data.map
      getContent()
    },(e)=>{
      console.log(e)
    })
  } else {
    console.log('spider is over.')
  }
}

run(pageno)

