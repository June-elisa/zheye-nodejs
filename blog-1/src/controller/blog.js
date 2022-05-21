/*
 * @Author: Reya
 * @Date: 2022-05-11 16:22:21
 * @LastEditors: Reya
 * @LastEditTime: 2022-05-20 17:02:03
 * @Description: 处理博客数据
 */
const { exec } = require('../db/mysql')
const getList = (authorId) => {
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
    return exec(sql)
}

const getDetail = (id) => {
    let sql = `
        select blogs.*,users.nick_name AS authorName,users.avatar AS authorAvatar,users.description AS authorDescription from blogs,users where blogs.author_id=users.id AND blogs.id=${id}
    `
    // let sql = `select * from blogs where id=${id}`
    return exec(sql).then(rows => {
        return rows[0]
    })
}

const newBlog = (blogData = {}, author_id) => {
    //  blogData 是一个博客对象，包含 title content author属性
    const { title, content, image } = blogData
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

    return exec(sql).then(insertData => {
        console.log('insertData is', insertData)
        return {
            id: insertData.insertId
        }
    })
}

const updateBlog = (blogData = {}) => {
    const { id,title, content, image } = blogData
    let sql = ''
    if (!image) {
        sql = `
        update blogs set title='${title}',content='${content}' where id=${id}
    `
    } else {
        sql = `
        update blogs set title='${title}',content='${content}',image='${image}' where id=${id}
    `
    }


    return exec(sql).then(data => {
        console.log('update data is', data)
        if (data.affectedRows > 0) {
            return true
        }
        return false
    })
}

const delBlog = (id, authorId) => {
    // console.log(id, author)
    const sql = `
        delete from blogs where id=${id} and author_id='${authorId}';
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