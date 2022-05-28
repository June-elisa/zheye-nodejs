/*
 * @Author: Reya
 * @Date: 2022-05-25 16:36:37
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-25 16:51:01
 * @Description: redis配置
 */
const redis = require('redis')
const { REDIS_CONF } = require('../conf/db')

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('error', err => {
    console.error(err)
})

module.exports = redisClient