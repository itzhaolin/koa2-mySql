const router = require('koa-router')()
const initMySql = require('../config/initMySql.js')

router.prefix('/api')

router.get('/', function (ctx, next) {
  ctx.body = 'api'
})

router.get('/userList', async (ctx, next) => {
  let res = await initMySql('select * from `user`')
  ctx.body = {
    res,
    status: 200
  }
})

router.post('/login', async (ctx, next) => {
  const { name, pwd } = ctx.request.body
  try {
    let res = await initMySql(`select * from user where name='${name}' and pwd=${pwd}`)
    if(res.length) {
      ctx.body = {
        res: '登录成功',
        status: 200
      }
    } else {
      ctx.body = {
        res: '账号或密码错误',
        status: 40003
      }
    }
  } catch {
    ctx.body = {
      res: '服务器内部错误',
      status: 50003
    }
  }
})

module.exports = router
