const router = require('koa-router')()
const initMySql = require('../config/initMySql.js')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!',
    name: 'zhangsan'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/userList', async (ctx, next) => {
  let res = await initMySql('select * from `user`')
  ctx.body = {
    res,
    status: 200
  }
})

router.get('/aa', async (ctx, next) => {
  ctx.body = {
    title: 'aa'
  }
})

module.exports = router
