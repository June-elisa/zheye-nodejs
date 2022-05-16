/*
 * @Author: Reya
 * @Date: 2022-05-11 15:44:58
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-11 16:15:36
 * @Description: 返回数据模型
 */
class BaseModel {
    constructor(data, message) {
        // 我们要传的data是对象类型，message是字符串类型
        if (typeof data === 'string') {
            // 为了兼容只传了message的情况
            this.message = data;
            data = null;
            message = null;
        }
        if (data) {
            this.data = data
        }
        if (message) {
            this.message = message;
        }
     }
}

class SuccessModel extends BaseModel{
    constructor(data, message) {
        super(data, message)
        this.errno = 0
    }
}

class ErrorModel extends BaseModel{
    constructor(data, message) {
        super(data, message)
        this.errno = -1
    }
}

module.exports = {
    SuccessModel, ErrorModel
}