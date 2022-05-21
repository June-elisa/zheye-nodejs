/*
 * @Author: Reya
 * @Date: 2022-05-10 20:36:19
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-21 12:31:21
 * @Description: 处理用户相关路由
 */
const { login, register, updateUserInfo, userInfo, allUserInfo } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { set, del } = require('../db/redis')

// 获取cookie的过期时间
const getCookieExpires = () => {
    const d = new Date()
    // 当前时间+24h
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log('d.toUTCString() is', d.toUTCString())
    return d.toUTCString()
}

// 统一的登录验证函数
const loginCheck = (req) => {
    if (!req.session.realId) {
        return Promise.resolve(new ErrorModel('尚未登录'))
    }

}

const handleUserRouter = (req, res) => {
    const method = req.method // GET POST



    // 登录
    if (method === 'POST' && req.path === '/api/user/login') {
        const { email, password } = req.body
        const result = login(email, password)
        return result.then(data => {
            if (data.email) {
                // 设置session
                req.session.email = data.email
                req.session.nickName = data.nick_name
                req.session.realId = data.id
                // 同步到redis
                set(req.sessionId, req.session)

                console.log(' req.session is', req.session)
                return new SuccessModel(data, '登录成功')
            }
            return new ErrorModel('登录失败')

        })
    }

    // 注册
    if (method === 'POST' && req.path === '/api/user/register') {
        const { email, nickName, password } = req.body
        const result = register(email, nickName, password)
        return result.then(data => {
            return new SuccessModel(data, '注册成功')
        }).catch(err => {
            console.log('err', err)
            if (err === 'ER_DUP_ENTRY') {
                return new ErrorModel('该邮箱已被注册！')
            } else {
                return new ErrorModel('注册失败！')
            }

        })
    }


    // 退出登录
    if (method === 'GET' && req.path === '/api/user/logout') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult
        }
        return del(req.sessionId).then(data => {
            return new SuccessModel('已注销登录')
        })
    }

    // 登录验证的测试
    if (method === 'GET' && req.path === '/api/user/login-test') {
        console.log('req.session:', req.session)
        if (req.session.email) {
            return Promise.resolve(new SuccessModel({
                session: req.session
            }))
        }
        return Promise.resolve(new ErrorModel('尚未登录'))
    }

    // 更新个人资料
    if (method === 'POST' && req.path === '/api/user/update') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult
        }
        const { nickName, description, avatar } = req.body
        if (!nickName && !description && !avatar) {
            return Promise.resolve(new ErrorModel('信息不能为空'))
        }
        const result = updateUserInfo(nickName, description, avatar, req.session.realId)
        return result.then(data => {
            return new SuccessModel()
        }).catch(err => {
            return new ErrorModel(err)
        })
    }

    // 获取当前用户信息
    if (method === 'GET' && req.path === '/api/user/current') {
        const loginCheckResult = loginCheck(req)
        let userId = req.query.userId;
        if (userId == 0) {
            if (loginCheckResult) {
                // 未登录
                return Promise.resolve(new SuccessModel({}))
            }
            userId = req.session.realId
        } 


        const result = userInfo(userId)
        return result.then(data => {
            console.log('data:',data)
            return new SuccessModel(data)
        }).catch(err => {
            return new ErrorModel(err)
        })
    }

    // 获取所有用户信息
    if (method === 'GET' && req.path === '/api/column/list') {
        const result = allUserInfo()
        return result.then(data => {
            return new SuccessModel(data)
        }).catch(err => {
            return new ErrorModel(err)
        })
    }
}

module.exports = handleUserRouter