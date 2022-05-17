/*
 * @Author: Reya
 * @Date: 2022-05-16 20:52:00
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-17 09:28:48
 * @Description: 连接redis
 */
const redis = require('redis')

// 创建客户端
const redisClient = redis.createClient(6379, '127.0.0.1')
redisClient.on('error', err => {
    console.error(err)
})

// 测试
redisClient.set('myname', 'Reya', redis.print)
// 获取是异步
redisClient.get('myname', (err, val) => {
    if (err) {
        console.error(err)
        return
    }
    console.log('val',val)

    // 退出
    redisClient.quit()
}) 