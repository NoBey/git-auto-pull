
const Koa = require('koa');
const app = new Koa();
var bodyParser = require('koa-bodyparser');
var process = require('child_process');
const mount = require('koa-mount');

let i = 0
app.use(bodyParser());
app.use(async ctx => {
    i++;
  ctx.body = 'Hello World-------' + i;

  const b = new Koa();

  b.use(async function (ctx, next){
    await next();
    ctx.body = 'World';
  });
  app.use(mount('/hello', b));

//   process.exec('git pull', {'cwd':'/home/coding/workspace'},
//   function (error, stdout, stderr) {
//       console.log('stdout========================\n' + stdout);
//       console.log('stderr========================\n' + stderr);
//       if (error !== null) {
//           res.send('<pre>fail!!!\n' + stdout + error + '</pre>');
//       } else {
//           res.send('<pre>done!!!\n' + stdout + '</pre>');
//       }
//   });

});



// app.post('/webhook', function(req,res){
//     console.log('print', req.body);
//     console.info(req.body["token"]);
//     if('xxx' === req.body['token'] ){

//     console.info(process);

//     } else {
//         console.log(' failed token ')
//         res.send('<pre>token不正确?</pre>');
//     }
// });


app.listen(3000);