// inset module
let http = require('http')
let querystring = require('querystring')
let cheerio = require('cheerio')
let _ = require('lodash')
// util
let {exportHtml,extractDocID} = require('./util')
// config
let {folderContains,hostname,searchMode,detailMode,dist} = require('./config')

// post request
let search = function (pageno) {
  return new Promise((resolve, reject) => {
    pageno = pageno || 1
    console.log('search the doc, pageno : ',pageno)
    let result = ''
    // set conditions
    searchMode.conditions.pageno = pageno
    dist.subdir = ((pageno-1)*folderContains+1)+'-'+(pageno*folderContains)
    let postData = querystring.stringify(searchMode.conditions)
    searchMode.options.headers[ 'Content-Length'] = Buffer.byteLength(postData)
    // create http request
    let req = http.request(searchMode.options, (res) => {
      res.setEncoding('utf8')
      res.on('data', (chunk) => result += chunk)
      res.on('end', () => {
        let {list, map} = extractDocID(JSON.parse(result))
        console.log('searching is over and Docs\' size : ', list.length)
        resolve({list,map})
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
      http.get('http://'+hostname+detailMode.path_prefix+detailMode.path_suffix, (res)=>{
        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', (chunk) => rawData += chunk)
        res.on('end', () => {
          let $ = cheerio.load(rawData)
          resolve($('iframe').attr('src'))
        })
      }).on('error', (e) => {
        reject(`extractDetail problem with request: ${e.message},doc : `,docName)
      })
    } else {
      reject('docId is undefined')
    }
  })
}

let extractContent = function (docName, path) {
  return new Promise((resolve, reject) => {
    if (path) {
      http.get('http://'+hostname+path, (res)=>{
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
          exportHtml(dist.path+'\\'+dist.subdir,docName+'.'+dist.fileType,rawData)
          resolve()
        })
      }).on('error', (e) => {
        reject(`extractContent problem with request: ${e.message}, path :`,path)
      })
    } else {
      reject('path is undefined')
    }
  })
}

module.exports = {search,extractDetail,extractContent}