# MongoDB

## 核心概念

数据库：数据仓库，可以创建多个数据仓库，数据库可以存放很多集合
集合：类似于 js 中的数组，集合中可以存放很多文档
文档：数据库中的最小单位，类似于 js 中的对象

## 下载

1. 下载 5.0.14 zip
2. 将压缩包移动到 C:\Program Files 下
3. 在 c 盘创建一个 data 文件夹，文件夹下创建一个名叫 db 的文件夹

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

## 文档命令

1. 插入文档
   db.集合名.insert(文档对象)
2. 查询文档
   db.集合名.find(查询条件)
3. 更新文档
   db.集合名.update(查询条件,新的文档)
   db.集合名.update({name:'xxx'},{$set:{age:19}})
4. 删除文档
   db.集合名.remove(查询条件)

## Mongoose

一个对象文档模型库，方便使用代码操作 mongodb

```js
//导入mongoose
const mongoose = require('mongoose');
//连接mongodb服务
mongoose.connect('mongodb://127.0.0.1:27017/test');
//设置回调
mongoose.connection.once('open', () => {
  //创建文档的结构对象
  //设置集合中文档的属性以及属性值的类型
  let bookSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: String,
      default: 'xxx',
    },
    type: {
      type: String,
      enum: ['1', '2'],
    },
    price: Number,
  });
  //创建模型对象，通过这个模型可以对文档进行增删改查操作
  let bookModel = mongoose.model('books', bookSchema);
  //新增
  bookModel
    .create({
      name: '西游记',
      author: '吴承恩',
      price: 10,
    })
    .then((data) => {
      console.log('lfsz', data);
    })
    .catch((err) => {
      console.log('lfsz err', err);
    });
  //删除单个
  bookModel
    .deleteOne({ author: '西游记' })
    .then((data) => {
      console.log('lfsz', data);
    })
    .catch((err) => {
      console.log('lfsz', err);
    });
  //批量删除
  bookModel
    .deleteMany({ author: '西游记' })
    .then((data) => {
      console.log('lfsz', data);
    })
    .catch((err) => {
      console.log('lfsz', err);
    });
  //更新单个
  bookModel
    .updateOne({ author: 'xi' }, { author: '1' })
    .then((data) => {
      console.log('lfsz', data);
    })
    .catch((err) => {
      console.log('lfsz', err);
    });
  //读取
  bookModel.findOne({});
  bookModel.find({});
});
mongoose.connection.on('error', () => {});
mongoose.connection.on('close', () => {});
//关闭连接
// mongoose.disconnect()
```

### 条件控制

```js
//等于
{price：1}
//小于
{price：{$lt:1}}
//大于
{price：{$gt:1}}
//大于等于
{price：{$gte:1}}
//小于等于
{price：{$lte:1}}
//不等于
{price：{$ne:1}}
//或
{$or：[{price:1},{price:2}]}
//与
{$and：[{price:1},{price:2}]}
//正则
{name:/xx/}

```

### 个性化读取

```js
//读取部分字段
model
  .find()
  .select({ name: 1, author: 1 })
  .exec((err, data) => {});
//数据排序,1：正序，-1：倒序
model
  .find()
  .sort({ price: 1 })
  .exec((err, data) => {});
//数据截断skip：跳过，limit：截取
model
  .find()
  .sort({ price: 1 })
  .skip(3)
  .limit(3)
  .exec((err, data) => {});
```

### 代码模块化

```js
//db/db.js
modile.exports = function (success, error) {
  //导入mongoose
  const mongoose = require('mongoose');
  //连接mongodb服务
  mongoose.connect('mongodb://127.0.0.1:27017/test');
  //设置回调
  mongoose.connection.once('open', () => {
    success();
  });
  mongoose.connection.on('error', () => {
    error();
  });
  mongoose.connection.on('close', () => {});
};

//models/BookModel.js
const mongoose = require('mongoose');
//设置集合中文档的属性以及属性值的类型
let bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    default: 'xxx',
  },
  type: {
    type: String,
    enum: ['1', '2'],
  },
  price: Number,
});
//创建模型对象，通过这个模型可以对文档进行增删改查操作
let bookModel = mongoose.model('books', bookSchema);
module.exports = bookModel;

//index.js
const db = require('./db/db.js');
const bookmodel=require('./models/BookModel')
db(
  () => {},
  () => {}
);
```
### 可视化界面

https://github.com/Studio3T/robomongo/releases