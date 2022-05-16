/*
 * @Author: Reya
 * @Date: 2022-05-10 09:11:16
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-10 09:15:26
 * @Description: commonjs式的导出
 */
function add(a, b) {
    return a + b
}

function mul(a, b) {
    return a * b
}

module.exports = {
    add,
    mul
}