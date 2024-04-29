/**
 * @Author: liuyue.lfsz liufansizhe@come-future.com
 * @Date: 2024-04-07 10:11:03
 * @LastEditors: liuyue.lfsz liufansizhe@come-future.com
 * @LastEditTime: 2024-04-07 15:03:19
 * @FilePath: /shiny-system/node/router/user.js
 * @Description: 
 **/
const express=require('express')
const router=express.Router()
const router_handle=require('../router_handle/user')
router.post('/reguser',router_handle.regUser)
router.get('/login',router_handle.login)
module.exports=router