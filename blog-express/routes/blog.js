/*
 * @Author: Reya
 * @Date: 2022-05-24 18:59:58
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-25 23:12:23
 * @Description: 博客路由
 */
var express = require('express');
var router = express.Router();
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


// 某用户的博客列表
router.get('/list', (req, res, next) => {
    let { authorId } = req.body
    if (!authorId) {
        authorId = req.session.realId
    }

    const result = getList(authorId)
    return result.then(listData => {
        res.json(
            new SuccessModel(listData)
        )
    })
});

// 获取博客详情
router.get('/detail', (req, res, next) => {
    const id = req.query.id
    const result = getDetail(id)
    return result.then(data => {
        res.json(
            new SuccessModel(data)
        )
    })
});

// 新建一篇博客
router.post('/new', loginCheck, (req, res, next) => {
    /* if (req.session.email == null) {
        // 未登录
        res.json(
            new ErrorModel('未登录')
        )
        return
    } */

    req.body.author = req.session.username
    const result = newBlog(req.body, req.session.realId)
    return result.then(data => {
        res.json(
            new SuccessModel(data)
        )
    })
});

// 更新一篇博客
router.post('/update', loginCheck, (req, res, next) => {
    if (!req.body.id) {
        res.json(
            new ErrorModel('博客id未传')
        )
        return
    }
    const result = updateBlog(req.body, req.session.realId)
    return result.then(val => {
        if (val) {
            res.json(
                new SuccessModel('更新博客成功')
            )
            return
        }
        res.json(
            new ErrorModel('更新博客失败')
        )

    })
});

// 删除一篇博客
router.post('/del', loginCheck, (req, res, next) => {
    const result = delBlog(req.body.id, req.session.realId)
    return result.then(val => {
        if (val) {
            res.json(
                new SuccessModel('删除博客成功')
            )
            return
        } 
        res.json(
            new ErrorModel('删除博客失败')
        )   
    })
});

module.exports = router;