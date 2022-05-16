/*
 * @Author: Reya
 * @Date: 2022-05-13 14:55:00
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-13 20:35:23
 * @Description: 数据库配置
 */
const env = process.env.NODE_ENV // 环境参数

// 配置
let MYSQL_CONF

if (env === 'dev') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'root',
        port: '3306',
        database: 'myblog'       
    }
}

if (env === 'production') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'root',
        port: '3306',
        database: 'myblog'
    }    
}

module.exports = {
    MYSQL_CONF
}