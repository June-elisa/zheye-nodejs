/*
 * @Author: Reya
 * @Date: 2022-05-28 14:52:29
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-28 20:55:53
 * @Description: 博客相关路由
 */
const router = require('koa-router')()
const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog')
const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')


router.prefix('/api/blog')

// 某用户的博客列表
router.post('/list', async function (ctx, next) {
    let { authorId } = ctx.request.body
    if (!authorId) {
        authorId = ctx.session.realId
    }

    const listData = await getList(authorId)
    ctx.body = new SuccessModel(listData)
})

// 获取博客详情
router.get('/detail', async (ctx, next) => {
    const id = ctx.query.id
    const data = await getDetail(id)
    ctx.body = new SuccessModel(data)
})

// 新建一篇博客
router.post('/new', loginCheck, async (ctx, next) => {
    ctx.request.body.author = ctx.session.username
    const data = await newBlog(ctx.request.body, req.session.realId)
    ctx.body = new SuccessModel(data)
})

// 更新一篇博客
router.post('/update', loginCheck, async  (ctx, next) => {
    if (!ctx.request.body.id) {
        ctx.body = new ErrorModel('博客id未传')
        return
    }
    const val = await updateBlog(ctx.request.body, ctx.session.realId)
    if (val) {
        ctx.body = new SuccessModel('更新博客成功')
        return
    }
    ctx.body = new ErrorModel('更新博客失败')
})

// 删除一篇博客
router.post('/del', loginCheck, async  (ctx, next) => {
    const val = await delBlog(ctx.request.body.id, ctx.session.realId)
    if (val) {
        ctx.body = new SuccessModel('删除博客成功')
        return
    }
    ctx.body = new ErrorModel('删除博客失败')
})


module.exports = router
