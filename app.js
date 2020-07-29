const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')
const koaBody = require('koa-body')
const static = require('koa-static');
const path = require('path')

const index = require('./routes/index')
const users = require('./routes/users')

// error handler
onerror(app)

app.use(koaBody({
  multipart: true,
  formidable: {
    maxFieldsSize: 20 * 1024 * 1024, // 最大文件为20兆
    multipart: true // 是否支持 multipart-formdate 的表单
  }
}))

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(cors())
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))
app.use(static(path.join(__dirname)));

// logger & catch error
app.use(async (ctx, next) => {
  const start = new Date()
  try {
    ctx.error = (code, message) => {
      if (typeof code === 'string') {
        message = code;
        code = 500;
      }
      ctx.throw(code || 500, message || '服务器错误');
    };
    await next();
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  } catch (e) {
    let status = e.status || 500;
    let message = e.message || '服务器错误';
    ctx.response.body = { status, message };

  }
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.warn('server error:', ctx)
  // const { response } = ctx
  // ctx.body = { message: '服务器内部错误' }
});

module.exports = app
