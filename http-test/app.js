/*
 * @Author: Reya
 * @Date: 2022-05-10 09:11:16
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-10 20:00:30
 * @Description: 处理http请求的总和示例
 */
const http = require('http')
const queryString = require('querystring')

const server = http.createServer((req, res) => {
    const method = req.method
    const url = req.url
    const path = url.split('?')[0]
    const query = queryString.parse(url.split('?')[1])

    // 设置返回格式为 JSON
    res.setHeader('Content-Type', 'application/json')

    // 返回的数据
    const resData = {
        method,
        url,
        path,
        query
    }

    // 返回
    if (method === 'GET') {
        res.end(JSON.stringify(resData))
    }

    if (method === 'POST') {
        // 接收数据
        let postData = ''
        req.on('data', chunk => {
            console.log('chunk', chunk)
            postData += chunk.toString()
        })
        req.on('end', () => {
            resData.postData = postData
            // 返回
            res.end(JSON.stringify(resData))
        })
    }
})



server.listen(8000)
console.log('OK')
