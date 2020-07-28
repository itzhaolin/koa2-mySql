const mysql = require('mysql')
const pool = mysql.createPool({
    user: 'root',//用户
    password: '12345678',//密码
    database: 'my',//数据库
    host: '127.0.0.1',//数据库地址
})
  // 数据池中进行会话操作
const initMySql = function( sql, values ) {
    return new Promise(( resolve, reject ) => {
      pool.getConnection(function(err, connection) {
        if (err) {
          reject( err )
        } else {
          connection.query(sql, values, ( err, rows) => {
  
            if ( err ) {
              reject( err )
            } else {
              resolve( rows )
            }
            connection.release()
          })
        }
      })
    })
}

  module.exports = initMySql