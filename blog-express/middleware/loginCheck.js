/*
 * @Author: Reya
 * @Date: 2022-05-25 17:23:02
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-25 17:27:26
 * @Description: 登录验证的中间件
 */
const { ErrorModel } = require('../model/resModel')

module.exports = (req, res, next) => {
    if (req.session.email) {
        next()
        return
    }
    res.json(
        new ErrorModel('未登录')
    )
} 