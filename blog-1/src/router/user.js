/*
 * @Author: Reya
 * @Date: 2022-05-10 20:36:19
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-16 17:11:28
 * @Description: 处理用户相关路由
 */
const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 获取cookie的过期时间
const getCookieExpires = () => {
    const d = new Date()
    // 当前时间+24h
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log('d.toUTCString() is', d.toUTCString())
    return d.toUTCString()
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
                // 设置session
                req.session.username = data.username
                req.session.realname = data.realname

                console.log(' req.session is', req.session)
                return new SuccessModel('登录成功')
            }
            return new ErrorModel('登录失败')

        })
    } 

    // 登录验证的测试
    if (method === 'GET' && req.path === '/api/user/login-test') {
        if (req.session.username) {
            return Promise.resolve(new SuccessModel({
                // username:req.session.username
                session:req.session
            }))
        }
        return Promise.resolve(new ErrorModel('尚未登录') )
    }

}

module.exports = handleUserRouter