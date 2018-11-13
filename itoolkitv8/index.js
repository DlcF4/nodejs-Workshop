const xt = require("itoolkit");

process.env.DB2CCSID = '65535'; // CSSID forzato altrimenti sql 
//Conversione carattere tra CCSID 1208 e CCSID 65535 non valida.
//Error: SQLSTATE=57017 SQLCODE=-332 Conversione carattere tra CCSID 1208 e CCSID 65535 non valida.



var express = require('express'),
    bodyParser = require('body-parser');
    
var app = express();
app.use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: false }));

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.get('/', function(req, res) {
 res.render('index', { title: 'Node.js Workshop', message: 'Hey I\'m on IBMi!'})
});

app.get('/dspsysstatus', function(req, res) {
	var	conn = new xt.iConn('*LOCAL');
	conn.add(xt.iSh("system -i DSPSYSSTS"));
	//conn.debug(true);
	function cb(str) {
		res.render('sysstatus', { title: 'Node.js Workshop', data:xt.xmlToJson(str)[0].data})
	} 
	conn.run(cb,true); // con.run(callback,sync) default sync=false --> Asincrona ma driver lancha eccezione. Da indagare!
 
});

app.get('/active_job', function(req, res) {
	var filter =req.query.filter;
	var call ='system -i WRKACTJOB';
	if(filter){
		call=call+' | grep '+filter // utilizzo funzionalità shell 
	}
	var	conn = new xt.iConn('*LOCAL');
	conn.add(xt.iSh(call));
	function cb(str) {
		
		res.render('activejob', { 
			title: 'Node.js Workshop', 
			filter:filter,
			data:xt.xmlToJson(str)[0].data, // xmlToJson per facilitare lettura in Javascript
			form_action:'/active_job'
			})
		
	} 
	conn.run(cb,true); 
	 
});
app.get('/rpg_programm', function(req, res) {
	var a =req.query.a;
	var b =req.query.b;
	var plist='';
	var resilt='';
	if(a){
		
		var conn = new xt.iConn("*LOCAL");
		var pgm = new xt.iPgm("ZNODE_WS", {"lib":"SME_NEV"});
		pgm.addParam(a,'10A');
		pgm.addParam(b,'10A');
		pgm.addParam('','20A');
		conn.add(pgm);
		conn.run(function(str){
			console.log('XML-----------------------------');
			console.log(str);
			console.log('JSON----------------------------');
			console.log(xt.xmlToJson(str));
			
			plist=xt.xmlToJson(str)[0].data;
			console.log('JSON PLIST----------------------');
			console.log(plist);
			res.render('rpgProg', { 
				title: 'Node.js Workshop', 
				a:a,
				b:b,
				plist:JSON.stringify(plist),
				result:plist[2].value,
				form_action:'/rpg_programm'
				});
		},true);
		
	}
	else
	{
		res.render('rpgProg', { 
			title: 'Node.js Workshop', 
			form_action:'/rpg_programm'
			});
	};			
});
  
var port =30001;
app.listen(port, function() {
  console.log('http://0.0.0.0:%d\ncrtl+c for exit', port);
});