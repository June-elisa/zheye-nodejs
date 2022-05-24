/*
 * @Author: Reya
 * @Date: 2022-05-24 10:05:56
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-24 10:24:27
 * @Description: 写日志用
 */
const fs = require('fs');
const path = require('path');

// 写日志
function writeLog(writeStream, log) {
    writeStream.write(log + '\n'); // 关键代码
}

// 生成 write Stream
function createWriteStream(filename) {
    // 找到日志文件地址
    const fullFileName = path.join(__dirname, '../', '../', 'logs', filename)
    const writeStream = fs.createWriteStream(fullFileName, { flags: 'a' }) // 'a':append追加
    return writeStream
}

// 写访问日志
const accessWriteStream = createWriteStream('access.log')
function access(log) {
    writeLog(accessWriteStream, log)
}

module.exports = {
    access
}