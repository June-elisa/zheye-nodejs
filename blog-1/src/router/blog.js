/*
 * @Author: Reya
 * @Date: 2022-05-10 20:36:02
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-21 11:42:09
 * @Description: 处理博客相关路由
 */
const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
// const { userInfo} = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 统一的登录验证函数
const loginCheck = (req) => {
    if (!req.session.realId) {
        return Promise.resolve(new ErrorModel('尚未登录'))
    }
    
}

const handleBlogRouter = (req, res) => {
    const method = req.method // GET POST
    const id = req.query.id

    // 获取博客列表
    if (method === 'POST' && req.path === '/api/blog/list') {
        let { authorId } = req.body
        console.log('authorId:',authorId)
        console.log('req.sessionId',req.session.realId)
        if (!authorId) {
            authorId = req.session.realId
        }


        const result = getList(authorId)
        return result.then(listData => {
            // return new ErrorModel('OMG!出错了')
            return new SuccessModel(listData)
        })
    }

    // 获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        const result = getDetail(id)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }

    // 新建一篇博客
    if (method === 'POST' && req.path === '/api/blog/new') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult
        }
 
        req.body.author = req.session.username
        const result = newBlog(req.body,req.session.realId)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }

    // 更新一篇博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult
        }
        if (!req.body.id) {
            return Promise.resolve(new ErrorModel('博客id未传'))
        }
        const result = updateBlog(req.body)
        return result.then(val => {
            if (val) {
                return new SuccessModel('更新博客成功')
            } else {
                return new ErrorModel('更新博客失败')
            }
        })

    }

    // 删除一篇博客
    if (method === 'POST' && req.path === '/api/blog/del') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult
        }
        
        const result = delBlog(req.body.id, req.session.realId)
        return result.then(val => {
            if (val) {
                return new SuccessModel('删除博客成功')
            } else {
                return new ErrorModel('删除博客失败')
            }
        })

    }
}

module.exports = handleBlogRouter