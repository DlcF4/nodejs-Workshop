const db = require('/QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/lib/db2a');

const dbconn = new db.dbconn()
dbconn.conn("*LOCAL")
dbconn.debug(true);
var stmt = new db.dbstmt(dbconn)
const schema = process.env.LITMIS_SCHEMA_DEVELOPMENT

var express = require('express');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.get('/', function(req, res) {
 res.render('index', { title: 'Node.js Workshop', message: 'Hey I\’m on IBMi!'})
});

var port = process.env.PORT || process.env.LITMIS_PORT_DEVELOPMENT
app.listen(port, function() {
  console.log('http://spaces.litmis.com:%d\ncrtl+c for exit', port);
});





