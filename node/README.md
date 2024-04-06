# 一、数据库
安装MySQL Server和MySQL workbench
MySQL Server:提供数据存储和服务
MySQL workbench：可视化的MySQL管理工具，用来操作存在MySQL里的数据
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