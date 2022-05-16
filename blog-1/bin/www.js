/*
 * @Author: Reya
 * @Date: 2022-05-10 09:11:15
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-11 16:54:50
 * @Description:  createServer逻辑部分
 */
const http = require('http')

const PORT = 8000
const serverHandle = require('../app')

const server = http.createServer(serverHandle)
server.listen(PORT)
