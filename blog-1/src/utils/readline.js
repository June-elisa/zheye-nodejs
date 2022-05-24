/*
 * @Author: Reya
 * @Date: 2022-05-24 11:15:39
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-24 11:46:37
 * @Description: 用readline，分析Firefox的占比
 */
const fs = require('fs')
const path = require('path')
const readline = require('readline')

// 文件名
const fileName = path.join(__dirname, '../', '../', 'logs', 'access.log')
// 创建 read stream
const readStream = fs.createReadStream(fileName)

// 创建readLine对象
const rl = readline.createInterface({
    input:readStream
})

let firefoxNum = 0
let sum = 0

// 逐行读取
rl.on('line', (lineData) => {
    if (!lineData) return;

    // 记录总行数
    sum++

    const arr = lineData.split(' -- ')
    if (arr[2] && arr[2].indexOf('Firefox') > 0) {
        // 累加 Firefox 的数量
        firefoxNum++
    }
})

// 监听读取完成
rl.on('close', () => {
    console.log('Firefox占比：'+ firefoxNum/sum)
})