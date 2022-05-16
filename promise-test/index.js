/*
 * @Author: Reya
 * @Date: 2022-05-11 17:04:43
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-11 18:06:48
 * @Description: 顺序读取a、b、c文件
 */
// fs、path都是nodejs的原生操作模块
const fs = require('fs')
const path = require('path')



/* // callback 方式获取一个文件的内容
function getFileContent(fileName, callback) {
    // 获取文件全名
    const fullFileName = path.resolve(__dirname, 'files', fileName) // path.resolve：拼接目录， __dirname:当前文件路径
    // 读取文件（是异步的）
    fs.readFile(fullFileName, (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        callback(JSON.parse(data.toString()))
    })
}


// 1、普通方法-- 层层嵌套callback-hell 回调地狱
getFileContent('a.json', aData => {
    console.log('a data', aData)
    getFileContent(aData.next, bData => {
        console.log('b data', bData)
        getFileContent(bData.next, cData => {
            console.log('c data', cData)
        })
    })
})
 */


// 2、用promise获取文件内容 -- 链式调用
function getFileContent(fileName) {
    const promise = new Promise((resolve, reject) => {
        const fullFileName = path.resolve(__dirname, 'files', fileName)
        fs.readFile(fullFileName, (err, data) => {
            if (err) {
                reject(err)
                return
            }
            resolve(JSON.parse(data.toString()))
        })
    })
    return promise
}

getFileContent('a.json').then(aData => {
    console.log('a Data', aData)
    return getFileContent(aData.next)
}).then(bData => {
    console.log('b Data', bData)
    return getFileContent(bData.next)    
}).then(cData => {
    console.log('b Data', cData)
})


// 3.用async await






/* async function readFileData() {
    // 同步写法
    try {
        const aData = await getFileContent('a.json')
        console.log('a data', aData)
        const bData = await getFileContent(aData.next)
        console.log('b data', bData)
        const cData = await getFileContent(bData.next)
        console.log('c data', cData)
    } catch (err) {
        console.error(err)
    }
}

readFileData() */

// async function readAData() {
//     const aData = await getFileContent('a.json')
//     return aData
// }
// async function test() {
//     const aData = await readAData()
//     console.log(aData)
// }
// test()

// async await 要点：
// 1. await 后面可以追加 promise 对象，获取 resolve 的值
// 2. await 必须包裹在 async 函数里面
// 3. async 函数执行返回的也是一个 promise 对象
// 4. try-catch 截获 promise 中 reject 的值
