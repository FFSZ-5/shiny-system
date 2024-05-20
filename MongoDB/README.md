# MongoDB
## 核心概念
数据库：数据仓库，可以创建多个数据仓库，数据库可以存放很多集合
集合：类似于js中的数组，集合中可以存放很多文档
文档：数据库中的最小单位，类似于js中的对象
## 下载
1. 下载5.0.14 zip
2. 将压缩包移动到C:\Program Files下
3. 在c盘创建一个data文件夹，文件夹下创建一个名叫db的文件

## 数据库命令
1. 显示所有数据库
show dbs
2. 切换到指定的数据库，如果数据库不存在则会新建一个
use 数据库
3. 显示当前所在的数据库
db
4. 删除当前数据库
use 数据库
db.dropDatabase()
## 集合命令
1. 创建集合
db.createCollection('集合名称')
2. 显示当前数据库中的所有集合
show collections
3. 删除某个集合
db.集合名.drop()
4. 重命名集合
db.集合名.renameCollection(集合名)