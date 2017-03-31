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
  let pageNum = pageno
  if (index < list.length) {
    let ep = new EventProcy()
    ep.after('next', config.requestSizeLimit, () => {
     if (index < list.length) {
       console.log('--------------------------------------')
       getContent()
       console.log('++++++++++++++++++++++++++++++++++++++')
     }
    })
    for (let j=0,i=index;(j < config.requestSizeLimit && i < list.length);j++,i++,index++) {
      jdSpider.extractDetail(list[i], map.get(list[i])).then((path) => {
        jdSpider.extractContent(pageNum,map.get(list[i]), path).then((v) => {
            ep.emit('next')
        },(e)=>{
          console.log(e)
          ep.emit('next')
        })
      }, (e) => {
        console.log(e)
        ep.emit('next')
      })
    }
    if (index >= list.length) {
      end = new Date()
      console.log('resolve the pageno : ',pageno,'and spend the time : ',(end-start)/1000.0,'s')
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
  if (pageno * config.pagesize <= config.total){
    jdSpider.search(pageno).then((data)=>{
      list = data.list
      index = 0
      map = data.map
      getContent()
    },(e)=>{
      console.log(e)
      if (e === 'lengthIsOver') {
        // 当前查询条件下，已无数据，进行新的条件下的查询
        console.log('current condition search is over.')
        newCondition()
      } else {
        run(++pageno)
      }
    })
  } else {
    // 当前查询条件下，已无数据，进行新的条件下的查询
    console.log('current condition search is over.')
    newCondition()
  }
}

let newCondition = function () {
  // 新条件
  pageno = 1
  let ajlb_i = config.index.ajlb
  let cbfy_i = config.index.cbfy
  cbfy_i++
  // 还有法院未查找
  if ( cbfy_i < config.cbfys.length) {
    config.index.cbfy = cbfy_i
    console.log('current condition : ',config.ajlbs[config.index.ajlb],config.cbfys[config.index.cbfy])
    run(pageno)
  } else {
    // 该案件类型 已查询完毕
    ajlb_i++
    if (ajlb_i < config.ajlbs.length) {
      config.index.ajlb = ajlb_i
      config.index.cbfy = 0
      console.log('current condition : ',config.ajlbs[config.index.ajlb],config.cbfys[config.index.cbfy])
      run(pageno)
    } else {
      // 所有的案件类型 都已查询完毕 结束
      console.log('spider is over.')
    }
  }
}

console.log('current condition : ',config.ajlbs[config.index.ajlb],config.cbfys[config.index.cbfy])
run(pageno)

