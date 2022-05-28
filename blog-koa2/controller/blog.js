/*
 * @Author: Reya
 * @Date: 2022-05-11 16:22:21
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-28 17:21:53
 * @Description: 处理博客数据
 */
const xss = require('xss')
const { exec } = require('../db/mysql')

const getList = async (authorId) => {
    let sql = `select * from blogs where author_id=${authorId}`

    /*     let sql = `select * from blogs where 1=1 `
        if (author) {
            sql += `and author='${author}' `
        }
        if (keyword) {
            sql += `and title like '%${keyword}%'`
        }
        sql += `order by create_time desc;` */

    // 返回 promise
    return await exec(sql)
}

const getDetail = async (id) => {
    let sql = `
        select blogs.*,users.nick_name AS authorName,users.avatar AS authorAvatar,users.description AS authorDescription from blogs,users where blogs.author_id=users.id AND blogs.id=${id}
    `
    // let sql = `select * from blogs where id=${id}`
    const rows = await exec(sql)
    return rows[0]
}

const newBlog = async (blogData = {}, author_id) => {
    //  blogData 是一个博客对象，包含 title content author属性
    const { title, content, image } = blogData
    // title = xss(title)
    let sql = ''
    if (!image) {
        sql = `
        insert into blogs(title, content,author_id)
        values('${title}','${content}','${author_id}')
    `
    } else {
        sql = `
        insert into blogs(title, content, image,author_id)
        values('${title}','${content}','${image}','${author_id}')
    `
    }

    const insertData = await exec(sql)

    return { id: insertData.insertId }

}

const updateBlog = async (blogData = {}, author_id) => {
    const { id, title, content, image } = blogData
    let sql = ''
    if (!image) {
        sql = `
        update blogs set title='${title}',content='${content}' where id=${id} and author_id=${author_id}
    `
    } else {
        sql = `
        update blogs set title='${title}',content='${content}',image='${image}' where id=${id} and author_id=${author_id}
    `
    }


    const data = await exec(sql)
    if (data.affectedRows > 0) {
        return true
    }
    return false
}

const delBlog = async (id, authorId) => {
    // console.log(id, author)
    const sql = `
        delete from blogs where id=${id} and author_id='${authorId}';
    `

    const delData = exec(sql)
    if (delData.affectedRows > 0) {
        return true
    }
    return false
}
module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} 