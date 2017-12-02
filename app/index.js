const db = require('/QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/lib/db2a');

const dbconn = new db.dbconn()
dbconn.conn("*LOCAL")
var stmt = new db.dbstmt(dbconn)
const schema = process.env.LITMIS_SCHEMA_DEVELOPMENT

var express = require('express'),
    bodyParser = require('body-parser');
    
var app = express();
app.use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: false }));

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.get('/', function(req, res) {
 res.render('index', { title: 'Node.js Workshop', message: 'Hey I\’m on IBMi!'})
});

app.get('/customers', function(req, res) {
 stmt = new db.dbstmt(dbconn);
 stmt.exec(`SELECT LSTNAM, CUSNUM FROM ${schema}.CUSTOMER`, function(results, err) {
   res.render('customers/index', { title: 'Customers', results: results})
  })
})

app.get('/customers/new', function(req, res) {
  res.render('customers/new', {result: {}, form_action: '/customers/create'})
})

app.post('/customers/create', function(req, res) {
  console.log(req.body);
  var sql = 
    `INSERT INTO ${schema}.CUSTOMER (CUSNUM,LSTNAM,INIT,STREET) VALUES (${req.body.CUSNUM}, '${req.body.LSTNAM}','${req.body.INIT}', '${req.body.STREET}')`
    console.log(sql);
  stmt = new db.dbstmt(dbconn);
  stmt.exec(sql, function(result, err){
    res.redirect('/customers')
  })
})

app.get('/customers/:id', function(req, res) {
 var sql = `SELECT * FROM ${schema}.CUSTOMER WHERE CUSNUM=${req.params.id}`
 stmt = new db.dbstmt(dbconn);
 stmt.exec(sql, function(result, err) {
   res.render('customers/show', { title: 'Customer', result: result[0]})
 })
})

app.get('/customers/:id/edit', function(req, res) {
  var sql = `SELECT * FROM ${schema}.CUSTOMER WHERE CUSNUM=${req.params.id}`
  stmt = new db.dbstmt(dbconn);
  stmt.exec(sql, function(result, err) {
    res.render('customers/edit',
      { title: 'Customer',
        result: result[0],
        form_action: `/customers/${req.params.id}/update`
      }
    )
  })
})

app.post('/customers/:id/update', function(req, res) {
  var sql = 
    `UPDATE ${schema}.CUSTOMER SET CUSNUM=${req.body.CUSNUM},LSTNAM='${req.body.LSTNAM}',INIT='${req.body.INIT}',STREET='${req.body.STREET}' WHERE CUSNUM=${req.body.CUSNUM}`
  stmt = new db.dbstmt(dbconn);
  stmt.exec(sql, function(result, err){
    res.redirect('/customers')
  })
})

app.get('/customers/:id/delete', function(req, res) {
  var sql = `DELETE FROM ${schema}.CUSTOMER WHERE CUSNUM=${req.params.id}`
  stmt = new db.dbstmt(dbconn);
  stmt.exec(sql, function(results, err){
    res.redirect('/customers')  
  })
})

var port = process.env.PORT || process.env.LITMIS_PORT_DEVELOPMENT
app.listen(port, function() {
  console.log('http://spaces.litmis.com:%d\ncrtl+c for exit', port);
});





