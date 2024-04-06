/**
 * @Author: ffsz-5 651828515@qq.com
 * @Date: 2024-04-01 19:33:36
 * @LastEditors: ffsz-5 651828515@qq.com
 * @LastEditTime: 2024-04-06 20:04:23
 * @FilePath: \shiny-system\node\app.js
 * @Description: 
 **/
const express = require('express')
const app = express()
const userRouter = require('./router/user')
//跨域配置
const cors = require('cors')
app.use(cors())
//解析表单数据:application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
app.use('/api', userRouter)
app.listen(3007, () => {
    console.log('lfsz', 'start 3007');
})