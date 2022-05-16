/*
 * @Author: Reya
 * @Date: 2022-05-10 20:36:19
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-14 18:32:30
 * @Description: 处理用户相关路由
 */
const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 获取cookie的过期时间
const getCookieExpires = () => {
    const d = new Date()
    // 当前时间+24h
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    return d.toGMTString()
}

const handleUserRouter = (req, res) => {
    const method = req.method // GET POST

    // 登录
    // if (method === 'POST' && req.path === '/api/user/login') {
    if (method === 'GET' && req.path === '/api/user/login') {
        // const { username, password } = req.body
        const { username, password } = req.query
        const result = login(username, password)
        return result.then(data => {
            if (data.username) {
                // 操作cookie
                // 设置在根路由下，这样所有的路径都会生效;httpOnly:只允许服务器端更改
                res.setHeader('Set-Cookie', `username=${data.username};path=/;httpOnly;expires=${getCookieExpires()}`)

                return new SuccessModel('登录成功')
            }
            return new ErrorModel('登录失败')

        })
    } 

    // 登录验证的测试
    if (method === 'GET' && req.path === '/api/user/login-test') {
        if (req.cookie.username) {
            return Promise.resolve(new SuccessModel({
                username:req.cookie.username
            }))
        }
        return Promise.resolve(new ErrorModel('尚未登录') )
    }

}

module.exports = handleUserRouter