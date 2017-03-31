let path = require('path')
let pagesize = 1000
let pageno = 1
let begin = 20070101
let end = 20180101

module.exports = {
  total: 1000000,
  hostname: 'www.zjsfgkw.cn',
  pagesize: pagesize,
  pageno: pageno,
  requestSizeLimit: 1,
  ajlbs: ['民事','刑事','行政','赔偿','执行'],
  cbfys: [1300,1301,1302,1303,1304,1305,1306,1307,1308,1309,1310,1311,1312,1313,1314,1406,1127,1315,1316,1317,1318,1319,1320,1321,1322,1323,1324,1325,1326,1327,1328,1329,1330,1331,1332,1333,1334,1335,1336,1337,1338,1339,1340,1341,1342,1343,1344,1345,1346,1347,1348,1349,1350,1351,1403,1352,1353,1354,1355,1356,1357,1358,1359,1360,1361,1362,1363,1364,1366,1367,1368,1369,1370,1371,1372,1373,1374,1375,1376,1382,1383,1384,1385,1386,1387,1388,1389,1390,1391,1392,1393,1394,1395,1396,1397,1398,1399,1400,1401,1377,1378,1379,1380,1381,1402],
  index: {
    ajlb: 0,
    cbfy: 0
  },
  searchMode: {
    options: {
      hostname: 'www.zjsfgkw.cn',
      port: 80,
      path: '/document/JudgmentSearch',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': 0
      },
      timeout: 20000
    },
    conditions: {
      pageno: pageno,
      pagesize: pagesize,
      ajlb: '民事',
      cbfy: 1300,
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
    fileType: 'doc'
  }
}