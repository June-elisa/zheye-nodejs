/*
 * @Author: Reya
 * @Date: 2022-05-11 20:38:55
 * @LastEditors: Reya
 * @LastEditTime: 2022-12-09 22:44:14
 * @Description: 处理用户数据
 */
const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

// 登录
const login = async (email, password) => {
    // 生成加密密码
    password = genPassword(password)

    // 有escape才能去掉单引号
    email = escape(email)
    password = escape(password)

    const sql = `
        select id,email,nick_name as nickName from users where email=${email} and password=${password}
    `
    const rows = await exec(sql)
    return rows[0] || {}

}

// 注册
const register = async (email, nickName, password) => {
    password = genPassword(password);
    if (!nickName) {
        nickName = Math.random().toString(36).slice(2);
    }
    const sql = `
        insert into users(email, password,nick_name) values ('${email}','${password}','${nickName}');
    `
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
}

// 更新个人资料
const updateUserInfo = async (nickName, description, avatar, id) => {
    const arr = []
    if (nickName) {
        arr.push(`nick_name='${nickName}'`)
    }
    if (description) {
        arr.push(`description='${description}'`)
    }
    if (avatar) {
        arr.push(`avatar='${avatar}'`)
    }
    str = arr.join(',')

    const sql = `
    update users set ${str} where id=${id};
    `

    try {
        const insertData = await exec(sql)
        return {
            id: insertData.insertId
        }
    } catch (err) {
        throw (err.code)
    }
}

// 获取当前用户信息
const userInfo = async (id) => {
    const sql = `
        select id,email,nick_name as nickName,avatar,description from users where id='${id}'
    `
    const rows = await exec(sql)
    return rows[0] || {}
}

// 获取所有用户信息
const allUserInfo = async () => {
    const sql = `
        select id,email,nick_name as nickName,avatar,description from users limit 10
    `
    console.log(sql);
    const rows = await exec(sql)
    return rows|| []
}
module.exports = {
    login,
    register,
    updateUserInfo,
    userInfo,
    allUserInfo
}