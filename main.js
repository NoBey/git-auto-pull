
const Koa = require('koa');
const app = new Koa();
var bodyParser = require('koa-bodyparser');
var process = require('child_process');
const mount = require('koa-mount');
app.use(bodyParser());

/**
 * 
 * @param {*} command 需要执行的命令
 * @param {*} path    执行目录
 * @param {*} before  开始执行的准备
 */
const shell = function (command, path, before){
    if(before) before();
    return new Promise(function(resolve, reject){
        process.exec(command, {'cwd': path},
        (error, stdout, stderr)=> {
           if (error) {
             reject('fail');
           } else {
             resolve('success');
           }
       });
    })
}

let Store = {
    'test': 'pending'
}

const test = new Koa();
test.use(async function (ctx, next){
    shell('wget baidu.com', '/Users/NoBey/Desktop/git-auto-pull', () => Store.test = 'pending').then( ok => Store.test = ok );
    ctx.body = Store.test
});

const info = new Koa();
info.use(async function (ctx, next){
    console.log(ctx.request.query)
    ctx.body = Store
});


app.use(mount('/test', test));
app.use(mount('/info', info));


app.listen(3000);