/*
 * @Author: Reya
 * @Date: 2022-05-24 19:00:14
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-27 10:08:39
 * @Description: 用户路由
 */
var express = require('express');
var router = express.Router();
const {
    login,
    register,
    updateUserInfo,
    userInfo,
    allUserInfo
} = require('../controller/user')
const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

// 登录
router.post('/login', (req, res, next) => {
    const { email, password } = req.body
    const result = login(email, password)
    return result.then(data => {
        if (data.email) {
            // 设置session
            req.session.email = data.email
            req.session.nickName = data.nick_name
            req.session.realId = data.id

            res.json(
                new SuccessModel(data, '登录成功')
            )
            return
        }
        res.json(
            new ErrorModel('登录失败')
        )
    })
});

// 注册
router.post('/register', (req, res, next) => {
    const { email, nickName, password } = req.body
    const result = register(email, nickName, password)
    return result.then(data => {
        res.json(
            new SuccessModel(data, '注册成功')
        )
    }).catch(err => {
        console.log('err', err)
        if (err === 'ER_DUP_ENTRY') {
            res.json(
                new ErrorModel('该邮箱已被注册！')
            )
        } else {
            res.json(
                new ErrorModel('注册失败！')
            )
        }

    })
});

// 退出登录
router.get('/logout', loginCheck, (req, res, next) => {
    req.session.email = ''
    req.session.id = ''
    res.json(
        new SuccessModel('已注销登录')
    )
});

// 更新个人资料
router.post('/update', loginCheck, (req, res, next) => {
    const { nickName, description, avatar } = req.body
    if (!nickName && !description && !avatar) {
        res.json(
            new ErrorModel('信息不能为空')
        )
        return

        // return Promise.resolve(new ErrorModel('信息不能为空'))
    }
    const result = updateUserInfo(nickName, description, avatar, req.session.realId)
    return result.then(data => {
        res.json(
            new SuccessModel()
        )
    }).catch(err => {
        res.json(
            new ErrorModel(err)
        )
    })
})

// 获取当前用户信息
router.get('/current', (req, res, next) => {
    let userId = req.query.userId;
    if (userId == 0 || userId == undefined) {
        if (!req.session.realId) {
            // 未登录
            res.json(
                new SuccessModel('未登录')
            )
            return
        }
        userId = req.session.realId
    }


    const result = userInfo(userId)
    return result.then(data => {
        res.json(
            new SuccessModel(data)
        )
    }).catch(err => {
        res.json(
            new ErrorModel(err)
        )
    })
})

// 获取所有用户的信息
router.get('/list', (req, res, next) => {
    const result = allUserInfo()
    return result.then(data => {
        res.json(
            new SuccessModel(data)
        )
    }).catch(err => {
        res.json(
            new ErrorModel(err)
        )
    })
})


router.get('/detail', (req, res, next) => {
    res.json({
        errno: 0,
        data: 'OK'
    })
});

// 登录验证的测试
router.get('/login-test', (req, res, next) => {
    // console.log('req.session:', req.session)
    if (req.session.email) {
        res.json({
            errno: 0,
            msg: '已登录'
        })
        return
    }
    res.json({
        errno: -1,
        msg: '未登录'
    })
})

// 记录页面的访问次数
router.get('/session-test', (req, res, next) => {
    const session = req.session
    // 用session记录浏览次数
    if (session.viewNum == null) {
        session.viewNum = 0
    }
    session.viewNum++
    res.json({
        viewNum: session.viewNum
    })
})

module.exports = router;