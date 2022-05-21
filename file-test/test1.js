/*
 * @Author: Reya
 * @Date: 2022-05-21 19:51:51
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-21 20:20:09
 * @Description: nodejs文件操作
 */

// 引入操作文件的库
const fs = require('fs')
// 引入路径库 
// 因为不同操作系统拼接路径方式不一样，比如：mac（'/user/local/etc/...'）、linux('c:\\sdf\sdf...')
const path = require('path')

// 拼接目录
const fileName = path.resolve(__dirname, 'data.txt')

// 操作1：读取文件内容
fs.readFile(fileName, (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    // data是二进制类型（buffer）,需要转换为字符串
    console.log(data.toString())
})


// 操作2：写入文件
const content = '这是新写入的内容\n'
// 写入配置
const option = {
    flag:'a' // 'a':追加写入；'w':覆盖
}
fs.writeFile(fileName, content, option, err => {
    if (err) {
        console.error(err)
    }
})

// 操作3：判断文件是否存在
fs.exists(fileName, exist => {
    console.log('exist',exist)
})
