/*
 * @Author: Reya
 * @Date: 2022-05-11 16:22:21
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-20 14:48:10
 * @Description: 处理博客数据
 */
const { exec } = require('../db/mysql')
const getList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%'`
    }
    sql += `order by create_time desc;`

    // 返回 promise
    return exec(sql)
}

const getDetail = (id) => {
    let sql = `select * from blogs where id=${id}`
    return exec(sql).then(rows => {
        return rows[0]
    })
}

const newBlog = (blogData = {}) => {
    //  blogData 是一个博客对象，包含 title content author属性
    const { title, content, author } = blogData
    const createtime = Date.now()
    const sql = `
        insert into blogs(title, content, author, create_time)
        values('${title}','${content}','${author}','${createtime}')
    `
    return exec(sql).then(insertData => {
        console.log('insertData is', insertData)
        return {
            id: insertData.insertId
        }
    })
}

const updateBlog = (id, blogData = {}) => {
    const { title, content } = blogData
    const sql = `
        update blogs set title='${title}',content='${content}' where id=${id}
    `

    return exec(sql).then(data => {
        console.log('update data is', data)
        if (data.affectedRows > 0) {
            return true
        }
        return false
    })
} 

const delBlog = (id, author) => {
    // console.log(id, author)
    const sql = `
        delete from blogs where id=${id} and author='${author}';
    `
    return exec(sql).then(data => {
        // console.log('delete data is', data)
        if (data.affectedRows > 0) {
            return true
        }
        return false
    })    
}
module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} 