<!--
 * @Author: ffsz-5 651828515@qq.com
 * @Date: 2024-03-31 22:22:05
 * @LastEditors: 刘范思哲 651828515@qq.com
 * @LastEditTime: 2024-05-12 22:30:20
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
path.resolve(__dirname,'index.html')
```

## http
### 请求报文
请求行+请求头+空行+请求体
请求行：请求方法+url+http版本号
### 响应报文
响应行+响应头+空行+响应体
响应行：http版本号+响应状态码+响应状态描述

响应状态码：
1xx：信息响应
2xx：成功响应
3xx：重定向消息
4xx：客户端错误响应
5xx：服务端错误响应

### ip
32位二进制数字组成
区域共享，家庭共享
本地回环ip地址：127.0.0.1~127.255.255.254
局域网ip（私网ip）：
192.168.0.0~192.168.255.255
172.16.0.0~172.31.255.255
10.0.0.0~10.255.255.255
广域网（公网ip）：除上述之外

### 端口
实现不同主机应用程序之间的通信

# 创建http服务
http协议默认端口80，https协议的默认端口443，http服务开发常用端口：3000,8080,8090,9000
```js
//导入http模块
const http=require('http')
const url=reuire('url')
//创建服务对象
const server=http.createServer((request,response)=>{
    //解决中文乱码
    //request.method
    //request.url
    //request.httpVersion
    //request.headers
    let res=url.parse(request.url)
    let body=''
    let url=new URL(request.url,'127.0.0.1')
    url.searchParams.get(xxx)
    request.on('data',chunk=>{
        body+=chunk
    })
    request.on('end',()=>{
        response.end('hello')
    })
    response.setHeader('content-type','text/html;charset=utf-8')
    response.end('hello')//设置响应体
})
//监听端口，启动服务
server.listen(9999,()=>{

})
```
## 设置响应
```js
const http=require('http')
const server=http.createServer((request,response)=>{
    response.statusCode=200//设置状态码
    response.statusMessage=''//设置描述
    response.setHeader('content-type','text/html;charset=utf-8')//设置响应头
    response.write()//设置响应体
    response.end()
})
```
# express框架
```js
const express=require('express')
const app=express()
app.get('xxx',(req,res)=>{
    //重定向
    res.redirect()
    //下载
    res.download()
    //json
    res.json()
    //响应文件内容
    res.sendFile()
})
```
## 静态资源中间件
```js
const express=require('express')
const app=express()
app.use(express.static(__dirname+'/public'))
```
## 获取请求体
```js
npm i body-parser
```
```js
const express=require('express')
const bodyParser=require('body-parser')
//解析json格式的请求体中间件
const jsonParser=bodyParser.json()
const urlencodedPArser=bodyParser.urlencoded({extended:false})
const app=express()
app.post('/login',urlencodedPArser,(req,res)=>{
console.log(req.body)
})
```
## 防盗链
```js
const express=require('express')
const app=express()
app.use((req,res,next)=>{
   let referer=req.get('referer')
   if(referer){
    let url=new URL(referer)
    let hostname=url.hostname
    if(hostname!=='127.0.0.1'){
        res.status(404).send('404')
        return
    }
   }
   next() 
})
```
## 路由模块化
```js
//homeRouter.js
const express=require('express')
const router=express.Router()
router.get('/home',(req,res)=>{

})
module.exports=router

//main.js
const express=require('express')
const homeRouter=require('xxx/homeRouter.js')
const app=express()
app.use(homeRouter)
```
## 模板引擎
html,js分离
```js
npm i ejs
```
```js
//基本使用
const ejs=require('ejs')
let china='zg'
let result=ejs.render('love <%= china %>',{china:china})
//列表渲染
const list=['1','2']
let result=ejs.render(`
<ul>
<% list.forEach(item=>{%>
<li>
<%= item %>
</li>
<% }) %>
</ul>
`,{list})
```
ejs文件引用
```js
const express=reuire('express')
cont app=express()
//设置模板引擎
app.set('view engine','ejs')
//设置模板文件存放位置
app.set('views',path.resolve(__dirname,'./xxx'))
app.get('/',(req,res)=>{
    let title='xxx'
    res.render('home',{title})
})
```
## express应用程序生成器（express-generator）
```js
npm i -g express-generator
```

## express 处理文件
```js
//安装依赖
npm i formidable
//代码
const formidable=require('formidable')
router.post('/file',(req,res)=>{
    //创建form对象
    const form=formidable({multiples:true,
    //设置上传文件的保存目录
    uploadDir:__dirname+'/../public/images',
    //保持文件后缀
    keepExtensions:true
    })
    //解析请求报文
    form.parse(req,(err,fields,files)=>{
        if(err){
            next(err)
            return
        }
        let url='/images/'+files.portrait.newFilename
        res.json({fields,files})
    })
})
```
## lowdb
```js
const low=require('lowdb')
const FileSync=require('lowdb/adapters/FileSync')
const adapter=new FileSync('db.json')
const db=low(adapter)
db.defaults({posts:[],user:{}}).write()
db.get('posts').push(1).write()
db.get('posts').value()
db.get('posts').remove({}).write()
db.get('posts').find({}).value()
db.get('posts').find({}).assign({}).write()

```
## express设置cookie
```js
const express=require('express')
const app=express()
//设置cookie
app.get('/set-cookie',(req,res)=>{
    res.cookie('name','xxx')//关闭浏览器的时候会销毁
    res.cookie('name','xxx',{maxAge:60*1000})//设置cookie为1分钟后过期
})
//删除cookie
app.get('/remove-cookie',(req,res)=>{
    res.clearCookie('name')
})
```
## 获取cookie
```js
npm i -S cookie-parser

const express=require('express')
const cookieParser=require('cookie-parser')
const app=express()
app.use(cookieParser())
app.get('/remove-cookie',(req,res)=>{
    console.log(req.cookies)    
})
```
## express 设置session
```js
npm i -S express-session
npm i -S connect-mongo
const session =require('express-session')
const MongoStore=require('connect-mongo')
const app=express()
app.use(session({
    name:'sid',//设置cookie的name，默认值是connect.sid
    secret:'xxx',//参与加密的字符串，又称签名
    saveUninitialized:false,//是否为每次请求都设置一个cookie
    resave:true,//是否每次请求时重新保存session
    store:MongoStore.create({
        mongoUrl:''
    }),
    cookie:{
        httpOnly:true,
        maxAge:1000*300
    }
}))
```