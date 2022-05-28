/*
 * @Author: Reya
 * @Date: 2022-05-28 14:52:29
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-28 14:58:27
 * @Description: 博客相关路由
 */
const router = require('koa-router')()

router.prefix('/api/blog')

router.get('/list', function (ctx, next) {
//   ctx.body = 'this is a users response!'
    const query = ctx.query
    ctx.body = {
        errno: 0,
        query,
        data:['获取博客列表']
    }
})



module.exports = router
