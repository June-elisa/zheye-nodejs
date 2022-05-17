/*
 * @Author: Reya
 * @Date: 2022-05-17 09:37:09
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-17 10:21:56
 * @Description: redis配置
 */
const redis = require('redis')
const { REDIS_CONF } = require('../conf/db')

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('error', err => {
    console.error(err)
})

function set(key, val) {
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.set(key, val, redis.print)
}

function get(key) {
    const promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }

            if (val == null) {
                resolve(null)
                return
            }

            // 这里不是为了抓住异常，而是为了兼容JSON转换的格式
            try {
                // 对象
                resolve(JSON.parse(val))              
            } catch (ex) {
                // 不是对象
                resolve(val)
            }

        }) 
    })
    return promise
}

module.exports = {
    set,
    get
}