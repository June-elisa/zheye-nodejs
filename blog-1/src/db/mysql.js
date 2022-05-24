/*
 * @Author: Reya
 * @Date: 2022-05-13 15:07:21
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-24 14:49:40
 * @Description: 
 */
const mysql = require('mysql');
const { MYSQL_CONF } = require('../conf/db')

// 创建连接对象
const con = mysql.createConnection(MYSQL_CONF)

// 开始连接
con.connect()

// 统一执行 sql 的函数
function exec(sql) {
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) {
                reject(err)
                return
            }
            resolve(result)
        })
    })
    return promise

}

module.exports = {
    exec,
    escape:mysql.escape
}