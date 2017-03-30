let path = require('path')
let pagesize = 100

module.exports = {
  total: 1000,
  folderContains: pagesize,
  hostname: 'www.zjsfgkw.cn',
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
      pageno: 1,
      pagesize: pagesize,
      ajlb: '',
      jarq1: 20070101,
      jarq2: 20180101
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