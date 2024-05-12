/**
 * @Author: 刘范思哲 651828515@qq.com
 * @Date: 2024-04-07 10:11:03
 * @LastEditors: 刘范思哲 651828515@qq.com
 * @LastEditTime: 2024-04-29 11:41:28
 * @FilePath: /shiny-system/node/db/index.js
 * @Description: 
 **/
const mysql=require('mysql')
module.exports=mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'admin123',
    database:'my_db'
})