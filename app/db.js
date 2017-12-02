const db = require('/QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/lib/db2a')

const dbconn = new db.dbconn()
dbconn.conn("*LOCAL")
const stmt = new db.dbstmt(dbconn)
// ATTENZIONE !!!!! VARIABILE LOCALE process.env 
const schema = process.env.LITMIS_SCHEMA_DEVELOPMENT

// UNA TANTUM CREIAMO TABELLA CUSTOMER E LA RIEMPIAMO
let sql =
`CREATE TABLE ${schema}.CUSTOMER ( \
CUSNUM NUMERIC(6, 0),            \
LSTNAM VARCHAR(50),              \
INIT CHAR(1),                    \
STREET VARCHAR(100),             \
CITY VARCHAR(100),               \
STATE CHAR(2),                   \
ZIPCOD NUMERIC(5, 0)             \
)`
stmt.exec(sql, function(result, err){
  console.log('error:' + err)
  console.log('result:' + result)

  sql = `INSERT INTO ${schema}.CUSTOMER VALUES (123,'Smith','L','123 Center','Mankato','MN',56001)`
  stmt.exec(sql, function(result,err){
    console.log('error:' + err)
    console.log('result:' + result)

    sql = `select * from ${schema}.systables WHERE TABLE_TYPE='T'`
    stmt.exec(sql, function(result,err) {
      console.log('error:' + err)
      console.log('result:' + JSON.stringify(result))
    })
  })
})