
const Koa = require('koa');
const app = new Koa();
var bodyParser = require('koa-bodyparser');
var process = require('child_process');
const mount = require('koa-mount');
let config = require('./config.json')
let tmp = {};

app.use(bodyParser());

app.use(async (ctx, next) => {
    console.log(`${ctx.method} ${ctx.url}`);
    await next();
  });
  

let Store = {
    'test': {
        state: 'pending',
        timelist:[],
        time:'',
        timeline: '',
        count: 0
    }
}
/**
 * 
 * @param {*} command 需要执行的命令
 * @param {*} path    执行目录
 * @param {*} name    开始执行的准备
 * @param {*} before  开始执行的准备
 */

const shell = function (command, path, name, before){
    Store[name].state = 'pending'
    const start = Date.now();
    if(before) before();
    return new Promise(function(resolve, reject){
        process.exec(command, {'cwd': path},
        (error, stdout, stderr)=> {
           const ms = Date.now() - start;
           Store[name].timelist.push(Store[name].time);
           Store[name].time =  Date.now();
           Store[name].timeline =  ms + 'ms';
           Store[name].count = Store[name].count + 1;
           if (error) {
             Store[name].state = 'fail'
             reject('fail');
           } else {
             Store[name].state = 'success'
             resolve('success');
           }
       });
    })
}



config.map(item => {
    const tmp = new Koa();
    tmp.use(async function (ctx, next){
        shell(item.cmd, item.pwd, item.name).then(()=>{});
        ctx.body = Store.test
    });
    console.log('挂载:/' + item.name)
    app.use(mount('/' + item.name, tmp));
})



const info = new Koa();
info.use(async function (ctx, next){
    const query = ctx.request.query
    if(!query.name) ctx.body = 'err';
     ctx.body = Store[query.name];
});


app.use(mount('/info', info));


app.listen(12345);