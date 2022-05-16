/*
 * @Author: Reya
 * @Date: 2022-05-10 09:11:16
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-10 09:48:47
 * @Description: commonjs式的引入
 */
const { add, mul } = require('./a')
// 等同于下面的操作
// const opts = require('./a')
// const add = opts.add
// const mul = opts.mul

// lodash一般用_代替
const _ = require('lodash')

const sum = add(10, 20)
const result = mul(100, 200)

console.log(sum)
console.log(result)

// 使用lodash的concat方法
const arr = _.concat([1, 2], 3)
console.log('arr...', arr)
 