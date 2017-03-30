let path = require('path')
let pagesize = 1000
let pageno = 1
let begin = 20070101
let end = 20180101

module.exports = {
  total: 1000,
  folderContains: pagesize,
  hostname: 'www.zjsfgkw.cn',
  pageno: pageno,
  requestSizeLimit: 30,
  searchMode: {
    options: {
      hostname: 'www.zjsfgkw.cn',
      port: 80,
      path: '/document/JudgmentSearch',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': 0
      }
    },
    conditions: {
      pageno: pageno,
      pagesize: pagesize,
      ajlb: '',
      jarq1: begin,
      jarq2: end
    }
  },
  detailMode: {
    path_prefix: '/document/JudgmentDetail/',
    path_suffix: ''
  },
  dist: {
    path: path.resolve(__dirname,'../dist'),
    subdir: '',
    fileType: 'doc'
  }
}