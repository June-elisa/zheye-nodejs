/*
 * @Author: Reya
 * @Date: 2022-05-28 14:58:08
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-28 21:06:54
 * @Description: 用户相关路由
 */
const router = require('koa-router')()
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

router.prefix('/api/user')

// 登录
router.post('/login', async (ctx, next) => {
    const { email, password } = ctx.request.body
    const data = await login(email, password)
    if (data.email) {
        // 设置session
        ctx.session.email = data.email
        ctx.session.nickName = data.nick_name
        ctx.session.realId = data.id

        ctx.body = new SuccessModel(data, '登录成功')
        return
    }
    ctx.body = new ErrorModel('登录失败')
})

// 注册
router.post('/register', async (ctx, next) => {
    try {
        const data = await register(email, nickName, password)
        ctx.body = new SuccessModel(data, '注册成功')
    } catch (err) {
        console.log('err', err)
        if (err === 'ER_DUP_ENTRY') {
            ctx.body = new ErrorModel('该邮箱已被注册！')
        } else {
            ctx.body = new ErrorModel('注册失败！')
        }

    }
});

// 退出登录
router.get('/logout', loginCheck, async (ctx, next) => {
    ctx.session.email = ''
    ctx.session.id = ''
    ctx.body = (
        new SuccessModel('已注销登录')
    )
});

// 更新个人资料
router.post('/update', loginCheck, async (ctx, next) => {
    const { nickName, description, avatar } = ctx.request.body
    if (!nickName && !description && !avatar) {
        ctx.body = new ErrorModel('信息不能为空')
        return
    }
    try {
        const data = await updateUserInfo(nickName, description, avatar, ctx.session.realId)
        ctx.body = new SuccessModel()
    } catch (err) {
        ctx.body = new ErrorModel(err)
    }

})

// 获取当前用户信息
router.get('/current', async (ctx, next) => {
    let userId = ctx.query.userId;
    if (userId == 0 || userId == undefined) {
        if (!ctx.session.realId) {
            // 未登录
            ctx.body =  new SuccessModel('未登录')
            return
        }
        userId = ctx.session.realId
    }

    try {
        const data = await userInfo(userId)    
        ctx.body = new SuccessModel(data)      
    } catch (err) {
        ctx.body =  new ErrorModel(err)      
    }
})

// 获取所有用户的信息
router.get('/list', async (ctx, next) => {
    try {
        const data = await allUserInfo()        
        ctx.body = new SuccessModel(data)      
    } catch (err) {
        ctx.body = new ErrorModel(err)     
    }
})

// 登录验证的测试
router.get('/login-test', async (ctx, next) => {
    // console.log('ctx.session:', ctx.session)
    if (ctx.session.email) {
        ctx.body = ({
            errno: 0,
            msg: '已登录'
        })
        return
    }
    ctx.body = ({
        errno: -1,
        msg: '未登录'
    })
})

// 记录页面的访问次数
router.get('/session-test', async (ctx, next) => {
    const session = ctx.session
    // 用session记录浏览次数
    if (session.viewNum == null) {
        session.viewNum = 0
    }
    session.viewNum++
    ctx.body = ({
        viewNum: session.viewNum
    })
})


module.exports = router