<!--
 * @Author: ffsz-5 651828515@qq.com
 * @Date: 2024-03-31 22:22:05
 * @LastEditors: 刘范思哲 651828515@qq.com
 * @LastEditTime: 2024-04-16 23:03:35
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

# fs
## 写入文件
```js
//fs.writeFile(文件名，待写入的数据，选项设置，写入回调)
fs.writeFile('./test.txt','123',err=>{
    //err写入失败：错误对象；写入成功：null
})
```
## 异步同步
fs.writeFile是异步的
fs.writeFileSync是同步的
## 文件追加写入

```js
//异步写法
fs.appendFile('./test.txt','456',err=>{

})
fs.writeFile('./test.txt','123',{flag:'a'},err=>{
    //err写入失败：错误对象；写入成功：null
})
//同步写法
fs.appendFileSync('./test.txt','456',err=>{

})

```
## 文件流式写入
写入频繁的场景
```js
const ws=fs.createWriteStream('./test.text')
ws.write(1)
ws.write(2)
```

## 文件读取
```js
//异步读取
fs.readFile('./test.txt',(err,data)=>{
   
})
//同步读取
const data=fs.readFileSync('./test.txt')
//流式读取(一块块的读：64KB)
const rs=fs.createReadStream('./test.txt')
rs.on('data'.chunk=>{

})
rs.on('end',()=>{

})
//读取流传给写入流
rs.pipe(ws)
```
## 文件重命名(文件的移动)
```js
fs.rename('xxx','xxx',err=>{
    
})
```
## 文件删除
```js
fs.unlink(文件路径,err=>{
    
})
fs.rm(文件路径,err=>{

})
```
## 文件夹操作
```js
//创建文件夹
fs.mkdir(文件夹路径,err=>{

})
//递归创建
fs.mkdir(文件夹路径,{recursive:true},err=>{

})
//读取
fs.readdir(文件夹路径,(err,data)=>{

})
//删除文件夹
fs.rmdir(文件夹路径,err=>{

})
//递归删除(不推荐使用，推荐rm)
fs.rmdir(文件夹路径,{recursive:true},err=>{

})
```
## 查看文件夹状态
```js
fs.stat('xxx',(err,data)=>{
    //是不是个文件
    data.isFile()
    //是不是个文件夹
    data.isDirectory()
})
```
## 路径
```js
//代码的绝对路径
__dirname
```