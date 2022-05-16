/*
 * @Author: Reya
 * @Date: 2022-05-11 20:38:55
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-14 09:46:09
 * @Description: 处理用户数据
 */
const { exec } = require('../db/mysql')
const login = (username, password) => {
    console.log(username, password)
    const sql = `
        select username,realname from users where username='${username}' and password='${password}'
    `
    return exec(sql).then(rows => {
        return rows[0] || {}
    })
}

module.exports = {
    login
}