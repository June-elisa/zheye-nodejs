/*
 * @Author: Reya
 * @Date: 2022-05-24 15:48:58
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-24 17:52:28
 * @Description: 加密
 */
// node自带的库
const crypto = require('crypto');

// 秘钥
const SECRET_KEY = 'June_88#'

// md5 加密
function md5(content) {
    let md5 = crypto.createHash('md5');
    return md5.update(content).digest('hex') // hex：把输出变成16进制的形式
}

// 加密函数
function genPassword(password) {
    const str = `password=${password}&key=${SECRET_KEY}`
    return md5(str)
}


module.exports = {
    genPassword
}