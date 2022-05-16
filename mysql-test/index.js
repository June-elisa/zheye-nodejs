/*
 * @Author: Reya
 * @Date: 2022-05-13 10:19:13
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-13 11:30:32
 * @Description: nodejs操作mysql
 */
// 1、引入mysql
const mysql = require('mysql')

// 2、创建连接对象
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: '3306',
    database:'myblog'
})

// 3、开始连接
con.connect()

// 4、执行 sql 语句
const sql = `update users set realname='李四2' where username='lisi';`
con.query(sql, (err, result) => {
    if (err) {
        console.error(err)
        return
    }
    console.log(result)
})

// 5、关闭连接
con.end()