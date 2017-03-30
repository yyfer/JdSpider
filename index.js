// inset
let fs = require('fs')
let EventProcy = require('eventproxy')
// local
let jdSpider = require('./src/jdSpider')
let config = require('./src/config')

// init
let pageno = config.pageno
let list = []
let index = 0
let map = {}

// time
let start = ''
let end = ''

let getContent = function () {
  if (index < list.length) {
    let ep = new EventProcy()
    ep.after('next', config.requestSizeLimit, () => {
     if (index < list.length) {
       getContent()
     }
    })
    for (let j=0,i=index;(j < config.requestSizeLimit && i < list.length);j++,i++,index++) {
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
    if (index >= list.length) {
      end = new Date()
      console.log('resolve the pageno : ',pageno,' spend the time : ',(end-start)/1000.0,'s')
      run(++pageno)
    }
  } else {
    end = new Date()
    console.log('resolve the pageno : ',pageno,' spend the time : ',(end-start)/1000.0,'s')
    run(++pageno)
  }
}

let run = function (pageno) {
  // mkdir /dist
  if (!fs.existsSync(config.dist.path)) {
    fs.mkdirSync(config.dist.path)
  }
  start = new Date()
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

