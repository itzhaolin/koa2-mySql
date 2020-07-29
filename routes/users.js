const router = require('koa-router')()
const initMySql = require('../config/initMySql.js')
const fs = require('fs')
const path = require('path')

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

router.post('/upload', function (ctx, next) {
  // console.log(ctx.request.files.file, '======')
  // 同一台服务器
  const uploadUrl = "http://localhost:3001/static/upload";
  const file = ctx.request.files.file;
  // 读取文件流
  const fileReader = fs.createReadStream(file.path);

  const filePath = path.join(__dirname, '../static/upload');
  // 组装成绝对路径
  const fileResource = filePath + `/${file.name}`;
  /*
   使用 createWriteStream 写入数据，然后使用管道流pipe拼接
  */
  const writeStream = fs.createWriteStream(fileResource);
  // 判断 /static/upload 文件夹是否存在，如果不在的话就创建一个
  if (!fs.existsSync(filePath)) {
    fs.mkdir(filePath, (err) => {
      if (err) {
        throw new Error(err);
      } else {
        fileReader.pipe(writeStream);
        ctx.body = {
          url: uploadUrl + `/${file.name}`,
          code: 0,
          message: '上传成功'
        };
      }
    });
  } else {
    fileReader.pipe(writeStream);
    ctx.body = {
      url: uploadUrl + `/${file.name}`,
      code: 0,
      message: '上传成功'
    };
  }
})

module.exports = router
