/*
 * @Author: Reya
 * @Date: 2022-05-10 09:11:15
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-17 11:08:05
 * @Description: 基础信息配置
 */
const querystring = require('querystring');
const { get, set } = require('./src/db/redis')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// 获取cookie的过期时间
const getCookieExpires = () => {
    const d = new Date()
    // 当前时间+24h
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log('d.toUTCString() is', d.toUTCString())
    return d.toUTCString()
}

// session数据
// const SESSION_DATA = {}

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

    // 解析 session(不用redis)
    /* let needSetCookie = false
    let userId = req.cookie.userid
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {}
        }
    } else {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        SESSION_DATA[userId] = {}    
    }
    console.log('SESSION_DATA:',SESSION_DATA)
    req.session = SESSION_DATA[userId] */


    // 解析session（使用redis）
    let needSetCookie = false
    let userId = req.cookie.userid
    // cookie 中无userId
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 初始化 redis 中的 session 值
        set(userId, {})
    } 
    // 获取session
    req.sessionId = userId
    // 获取userId对应的信息
    get(req.sessionId).then(sessionData => {
        
        if (sessionData == null) {
            // redis中没有存这个userId
            // 初始化 redis 中的 session值
            set(req.sessionId, {})
            // 设置session
            req.session = {}
        } else {
            // 取出redis中该userId的信息
            req.session = sessionData
        }

        // 处理 post data
        return getPostData(req)
    }).then(postData => {
        req.body = postData

        // 处理 blog 路由
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                // 没有cookie,设置cookie
                // 设置在根路由下，这样所有的路径都会生效;httpOnly:只允许服务器端更改
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
                }

                res.end(JSON.stringify(blogData))
            })
            return
        }



        // 处理 user 路由
        const userResult = handleUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
                }

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