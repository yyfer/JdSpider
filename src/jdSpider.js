// inset module
let http = require('http')
let querystring = require('querystring')
let cheerio = require('cheerio')
let _ = require('lodash')
// util
let {exportHtml,extractDocID} = require('./util')
// config
let {hostname,searchMode,detailMode,dist,index,ajlbs,cbfys} = require('./config')

// post request
let search = function (pageno) {
  return new Promise((resolve, reject) => {
    pageno = pageno || 1
    console.log('search the doc, pageno : ',pageno)
    let result = ''
    // set conditions
    searchMode.conditions.pageno = pageno
    searchMode.conditions.ajlb = ajlbs[index.ajlb]
    searchMode.conditions.cbfy = cbfys[index.cbfy]
    let postData = querystring.stringify(searchMode.conditions)
    searchMode.options.headers[ 'Content-Length'] = Buffer.byteLength(postData)
    // create http request
    let req = http.request(searchMode.options, (res) => {
      res.setEncoding('utf8')
      res.on('data', (chunk) => result += chunk)
      res.on('end', () => {
        try {
          let {list, map} = extractDocID(JSON.parse(result))
          console.log('searching is over and Docs\' size : ', list.length)
          if (list.length === 0) {
            reject('lengthIsOver')
          }
          resolve({list,map})
        } catch(e) {
          reject(e)
        }
      })
    })
    req.on('error', (e) => {
      reject(e)
    })
    req.write(postData)
    req.end()
  })
}

// get request
let extractDetail = function (docId, docName) {
  return new Promise((resolve, reject) => {
    if (docId) {
      detailMode.path_suffix = docId
      let timeoutEventId
      let req = http.get('http://'+hostname+detailMode.path_prefix+detailMode.path_suffix, (res)=>{
        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', (chunk) => rawData += chunk)
        res.on('end', () => {
          clearTimeout(timeoutEventId);
          let $ = cheerio.load(rawData)
          resolve($('iframe').attr('src'))
        })
      })
      req.on('error', (e) => {
        reject(`extractDetail problem with request: ${e.message},doc : `,docName)
      })
      req.on('timeout', (e) => {
        if(req.res){
          req.res('abort');
        }
        req.abort();
        reject(`extractDetail problem with request: ${e.message},doc : `,docName)
      })
      timeoutEventId = setTimeout(()=>{
        req.emit('timeout',{message:'have been timeout...'})
      },10000)
    } else {
      reject('docId is undefined')
    }
  })
}

let extractContent = function (pageno, docName, path) {
  return new Promise((resolve, reject) => {
    if (path) {
      let subpath = ajlbs[index.ajlb]
      let timeoutEventId
      let req = http.get('http://'+hostname+path, (res)=>{
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
          clearTimeout(timeoutEventId);
          exportHtml(dist.path+'\\'+subpath,docName+'.'+dist.fileType,rawData)
          resolve()
        })
      })
      req.on('error', (e) => {
        reject(`extractContent problem with request: ${e.message}, path :`,path)
      }).on('timeout', (e) => {
        if(req.res){
          req.res('abort');
        }
        req.abort();
        reject(`extractContent problem with request: ${e.message}, path :`,path)
      })
      timeoutEventId = setTimeout(()=>{
        req.emit('timeout',{message:'have been timeout...'})
      },10000)
    } else {
      reject('path is undefined')
    }
  })
}

module.exports = {search,extractDetail,extractContent}