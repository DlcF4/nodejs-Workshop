const db = require('/QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/lib/db2a');

const dbconn = new db.dbconn()
dbconn.conn("*LOCAL")
var stmt = new db.dbstmt(dbconn)
const schema = process.env.LITMIS_SCHEMA_DEVELOPMENT

var express = require('express');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.get('/', function(req, res) {
 res.render('index', { title: 'Node.js Workshop', message: 'Hey I\’m on IBMi!'})
});

app.get('/customers', function(req, res) {
    var sql = `SELECT LSTNAM, CUSNUM FROM ${schema}.CUSTOMER`;
    stmt = new db.dbstmt(dbconn);
    stmt.exec(sql, function(results,err) {
    if(err){
          res.render('error', { title: 'Error',reserr:{ sql: sql,resu:results,error:err}})
    }
    else{
        res.render('customers', { title: 'Customers', results: results})
    }
  });
});

app.get('/customer/:id', function(req, res) {
    var sql = `SELECT * FROM ${schema}.CUSTOMER WHERE CUSNUM=` + req.params.id
    stmt = new db.dbstmt(dbconn);
    stmt.exec(sql, function(result, err) {
    if(err){
          res.render('error', { title: 'Error',reserr:{ sql: sql,resu:result,error:err}})
      }
      else{
    res.render('customer', { title: 'Customer', result: result[0]})}
  })
})

var port = process.env.PORT || process.env.LITMIS_PORT_DEVELOPMENT
app.listen(port, function() {
  console.log('http://spaces.litmis.com:%d\ncrtl+c for exit', port);
});





