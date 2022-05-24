/*
 * @Author: Reya
 * @Date: 2022-05-24 09:06:16
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-24 09:47:52
 * @Description: stream的应用
 */
// 标准输入输出是linux的一个基本概念
// process.stdin.pipe(process.stdout)

// 栗子：返回请求的内容-- 网络IO
/* const http = require('http');
const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        req.pipe(res) // 最主要
    }
})
server.listen(8000) */

// 栗子：复制文件 -- 文件IO
/* const fs = require('fs')
const path = require('path')

const fileName1 = path.resolve(__dirname,'data.txt')
const fileName2 = path.resolve(__dirname, 'data-bak.txt')

const readStream = fs.createReadStream(fileName1)
const writeStream = fs.createWriteStream(fileName2)

readStream.pipe(writeStream)
// 监视每次读取的内容
readStream.on('data', chunk => {
    console.log(chunk.toString())
})
// 读取完毕执行
readStream.on('end', () => {
    console.log('copy done')
}) */

// 栗子：在http请求中的应用 -- 网络IO结合文件IO
/* const http = require('http');
const fs = require('fs')
const path = require('path')
const fileName1 = path.resolve(__dirname,'data.txt')
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        const readStream = fs.createReadStream(fileName1)
        readStream.pipe(res)
    }
})
server.listen(8000) */