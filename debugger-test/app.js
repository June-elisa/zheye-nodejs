// http是node.js自带的，所以不用额外安装
const http = require('http')

const server = http.createServer((req, res) => {
    res.writeHead(200, {'content-type': 'text/html'})
    res.end('<h1>hello world</h1>')
})

server.listen(3000, () => {
    console.log('listening on 3000 port')
})
 