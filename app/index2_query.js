const db = require('/QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/lib/db2a');

const dbconn = new db.dbconn()
dbconn.conn("*LOCAL")
dbconn.debug(true);
var stmt = new db.dbstmt(dbconn)
const schema = process.env.LITMIS_SCHEMA_DEVELOPMENT

var express = require('express');
var app = express();

app.get('/', function(req, res) {
    var sql=`SELECT * FROM ${schema}.CUSTOMER`;
    stmt = new db.dbstmt(dbconn);
    stmt.exec(sql, function(results, err) {
    if(err){
          console.log('err %s',err);
          res.render('error', { title: 'Error',reserr:{ sql: sql,resu:results,error:err}});
    } else {
          res.json(results);
      }
   });
});

var port = process.env.PORT || process.env.LITMIS_PORT_DEVELOPMENT
app.listen(port, function() {
  console.log('http://spaces.litmis.com:%d\ncrtl+c for exit', port);
});





