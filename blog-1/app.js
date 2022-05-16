/*
 * @Author: Reya
 * @Date: 2022-05-10 09:11:15
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-14 18:02:18
 * @Description: 基础信息配置
 */
const querystring = require('querystring');
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// 用于处理 post data
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }

        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            // console.log('chunk', chunk)
            postData += chunk.toString()
        })

        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(JSON.parse(postData))
        })
    })
    return promise
}

const serverHandle = (req, res) => {
    // 设置返回格式 JSON
    res.setHeader('Content-type', 'application/json')

    // 获取 path
    const url = req.url
    req.path = url.split('?')[0]

    // 解析 query
    req.query = querystring.parse(url.split('?')[1])

    // 解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || '' // k1=v1;k2=v2;k3=v3;
    cookieStr.split(';').forEach(item => {
        if (!item) return
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    })
    console.log('req.cookie:',req.cookie)

    // 处理 post data
    getPostData(req).then(postData => {
        req.body = postData

        // 处理 blog 路由
        // const blogData = handleBlogRouter(req, res)
        // if (blogData) {
        //     res.end(JSON.stringify(blogData))
        //     return
        // } 
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                res.end(JSON.stringify(blogData))
            })
            return
        }



        // 处理 user 路由
        // const userData = handleUserRouter(req, res)
        // if (userData) {
        //     res.end(JSON.stringify(userData))
        //     return
        // }
        const userResult = handleUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                res.end(JSON.stringify(userData))
            })
            return
        }
        // 未命中路由，返回 404
        res.writeHead(404, { "content-type": "text/plain" }) // 设置请求头
        res.write("404 Not Found\n") // 内容
        res.end()
    })



}

module.exports = serverHandle

// process.env.NODE_ENV