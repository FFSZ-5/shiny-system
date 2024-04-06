const express=require('express')
const router=express.Router()
const router_handle=require('../router_handle/user')
router.post('/reguser',router_handle.regUser)
router.post('/login',router_handle.login)
module.exports=router