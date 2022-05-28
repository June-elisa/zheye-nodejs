/*
 * @Author: Reya
 * @Date: 2022-05-11 20:38:55
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-24 16:42:58
 * @Description: 处理用户数据
 */
const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

// 登录
const login = (email, password) => {
    // 生成加密密码
    password = genPassword(password)
    
    // 有escape才能去掉单引号
    email = escape(email)
    password = escape(password)
    
    const sql = `
        select id,email,nick_name as nickName from users where email=${email} and password=${password}
    `
    return exec(sql).then(rows => {
        return rows[0] || {}
    })
}

// 注册
const register = (email, nickName, password) => {
    if (!nickName) {
        nickName = Math.random().toString(36).slice(2);
    }
    const sql = `
        insert into users(email, password,nick_name) values ('${email}','${password}','${nickName}');
    `
    return exec(sql).then(insertData => {
        console.log('insertData is', insertData)
        return {
            id: insertData.insertId
        }
    }).catch(err => {
        throw (err.code)
    })
}

// 更新个人资料
const updateUserInfo = (nickName, description, avatar, id) => {
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
    console.log('sql',sql)
    return exec(sql).then(insertData => {
        console.log('insertData is', insertData)
        return {
            id: insertData.insertId
        }
    }).catch(err => {
        throw (err.code)
    })
}

// 获取当前用户信息
const userInfo = (id) => {
    const sql = `
        select id,email,nick_name as nickName,avatar,description from users where id='${id}'
    `
    return exec(sql).then(rows => {
        return rows[0] || {}
    })
}

// 获取所有用户信息
const allUserInfo = (id) => {
    const sql = `
        select id,email,nick_name as nickName,avatar,description from users limit 10
    `
    return exec(sql).then(rows => {
        return rows || []
    })
}
module.exports = {
    login,
    register,
    updateUserInfo,
    userInfo,
    allUserInfo
}