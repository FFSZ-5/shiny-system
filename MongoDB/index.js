//导入mongoose
const mongoose = require('mongoose')
//连接mongodb服务
mongoose.connect('mongodb://127.0.0.1:27017/test')
//设置回调
mongoose.connection.once('open', () => {
    //创建文档的结构对象
    //设置集合中文档的属性以及属性值的类型 
    let bookSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        author: {
            type: String,
            default: 'xxx'
        },
        type: {
            type: String,
            enum: ['1', '2']
        },
        price: Number
    })
    //创建模型对象，通过这个模型可以对文档进行增删改查操作
    let bookModel = mongoose.model('books', bookSchema)
    //新增
    bookModel.create({
        name:'西游记',
        author: '吴承恩',
        price: 10
    }).then((data) => {

        console.log('lfsz', data);

    }).catch(err => {
        console.log('lfsz err', err);
    })
    //删除单个
    bookModel.deleteOne({author:'西游记'}).then(data=>{
        console.log('lfsz',data);
        
    }).catch(err=>{
        console.log('lfsz',err);
        
    })
    //批量删除
    bookModel.deleteMany({author:'西游记'}).then(data=>{
        console.log('lfsz',data);
        
    }).catch(err=>{
        console.log('lfsz',err);
        
    })
    //更新单个
    bookModel.updateOne({author:'xi'},{author:'1'
    }).then(data=>{
        console.log('lfsz',data);
        
    }).catch(err=>{
        console.log('lfsz',err);
        
    })
    //读取
    bookModel.findOne({})
    bookModel.find({})
})
mongoose.connection.on('error', () => {

})
mongoose.connection.on('close', () => {

})
//关闭连接
// mongoose.disconnect()