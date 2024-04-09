<!--
 * @Author: ffsz-5 651828515@qq.com
 * @Date: 2024-03-31 22:22:05
 * @LastEditors: ffsz-5 651828515@qq.com
 * @LastEditTime: 2024-04-09 23:03:36
 * @FilePath: \shiny-system\node\README.md
 * @Description: 
-->
# 一、数据库
安装MySQL Server和MySQL workbench
MySQL Server:提供数据存储和服务
MySQL workbench：可视化的MySQL管理工具，用来操作存在MySQL里的数据
bcryptjs用于密码加密，无法被破解
```js
npm i mysql bcryptjs

const bcrypt=require('bcryptjs')
const password=bcrypt.hashSync(password,10)
```
# 二、SQL
# 三、node搭建服务端
## 1.依赖
```js
npm i express@4.17.1
```
## 2.跨域
```JS
npm i cors@2.8.5
```
```JS
//跨域配置
const cors=require('cors')
app.use(cors())
```
## 3.解析表单数据
```JS
app.use(express.urlencoded({extended:false}))
```
## 4.数据验证模块
### 定义每条数据验证规则
```js
npm i @hapi/joi

const joi =require('@hapi/joi')
string()值必须是字符串
alphanum()值只能包含a-zA-Z0-9的字符串
min()最小长度
max()最大长度
required()必须的
pattern(正则)符合正则表达式
```
### 自动验证
中间件，参数是验证规则
```js
npm i @escook/express-joi
```
## 5.全局错误捕获
```js
const joi=require('@hapi/joi')
app.use(function(err,req,res,next){
    if(err instanceof joi.ValidationError) return xxx
})
```
## 6.生成jwt的token
生成的token前需要加 Bearer
```js
npm i jsonwebtoken
const jwt = require('jsonwebtoken')
const tokenStr=jwt.sign(user,xxx,{expiresIn:'10h'})
```
## 7.解析token
```js
npm i express-jwt

const expressjwt=require('express-jwt')
app.use(expressjwt({secret:xxx})).unless({path:[/^\/api/]})


app.use((err,req,res,next)=>{
    if(err.name==="UnauthorizedError")
})
```