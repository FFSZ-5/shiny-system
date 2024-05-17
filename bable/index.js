/**
 * @Author: 刘范思哲 651828515@qq.com
 * @Date: 2024-05-17 10:57:15
 * @LastEditors: 刘范思哲 651828515@qq.com
 * @LastEditTime: 2024-05-17 17:35:15
 * @FilePath: /shiny-system/bable/index.js
 * @Description: 
 **/
const parser = require('@babel/parser');
const fs = require('fs');
const traverse = require('@babel/traverse').default;
// 读取 JavaScript 文件内容
const code = fs.readFileSync('output.tsx', 'utf-8');

const myPlugin=function(){
    return {
        visitor:{
            CallExpression(path){
                console.log('lfsz',path);
            }
        }
    }
}
const data=require('@babel/core').transformSync(code,{
    sourceType: "module",
    presets: ["@babel/preset-typescript"],
    plugins: [
        ["@babel/plugin-proposal-decorators", { version: "2023-05" }],
        myPlugin()
      ],
      filename: "output.tsx"
})
// const data=require('@babel/core').parseSync(code,{
//     sourceType: "module",
//     presets: ["@babel/preset-typescript"],
//     plugins: [
//         ["@babel/plugin-proposal-decorators", { version: "2023-05" }],
//         myPlugin
//       ],
//       filename: "output.tsx"
// })
// fs.writeFile('output.json',JSON.stringify(data),()=>{})
// console.log("lfsz ~ data:", JSON.stringify(data) )
// console.log('lfsz',data.program.body);

// // 解析 JavaScript 代码为 AST
// const ast = parser.parse(code, {
//   sourceType: 'module', // 指定代码类型，可以是 'script' 或 'module'
//   plugins: ['tsx'],     // 支持 JSX 语法，根据需要添加其他插件
// });
// console.log("lfsz ~ ast:", ast)

// // 去除空格、* 号、\r、\n
function removeSpacesAsterisksAndNewlines(inputString) {
    const cleanedString = inputString.replace(/[\s*\r\n]/g, '');
    return cleanedString;
}


traverse(data, {
    FunctionDeclaration(path) {
        console.log("lfsz ~ FunctionDeclaration ~ path:", path)
        // 获取函数名称
        const functionName = path.node.id.name;
        // 获取参数列表
        const parameters = path.node.params.map(param => param.name);
        // 获取函数前的注释说明
        const { leadingComments } = path.node
        const leadingCommentText = leadingComments ? leadingComments.map(item => removeSpacesAsterisksAndNewlines(item.value)).join(',') : ''
        // 获取函数内部的注释
        const innerComments = path.node.body.body[0].leadingComments;
        console.log('Function Name:', functionName);
        console.log('Parameters:', parameters);
        console.log('Leading Comments:', leadingCommentText);
        if (innerComments) {
            console.log('Inner Comments:', innerComments.map(comment => comment.value));
        }

    },
    FunctionExpression(path) {
        console.log('Function Name (Expression):', path.node.id ? path.node.id.name : 'Anonymous');
        console.log('Parameters (Expression):', path.node.params.map(param => param.name).join(', '));
    }
});

