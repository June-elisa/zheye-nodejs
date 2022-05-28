/*
 * @Author: Reya
 * @Date: 2022-05-25 17:23:02
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-28 17:31:55
 * @Description: 登录验证的中间件
 */
const { ErrorModel } = require('../model/resModel')

module.exports = async (ctx, next) => {
    if (ctx.session.email) {
        await next()
        return
    }
    ctx.body = new ErrorModel('未登录')
} 