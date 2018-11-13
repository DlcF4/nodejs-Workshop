//
// Usage: node index.js [port_secure port_insecure host_name]
//
var app = require('express')();
var https = require('https')
var http = require('http')
var io = require('socket.io')()
var os = require('os')
var fs = require('fs')
if (process.version.substring(0,3) == "v6.") {
	///QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/lib/db2a
	var db = require('/QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/lib/db2a');
    var xt = require('/QOpenSys/QIBM/ProdData/OPS/Node6/os400/xstoolkit/lib/itoolkit');
}
else if (process.version.substring(0,3) == "v4.") {
	var db = require('/QOpenSys/QIBM/ProdData/OPS/Node4/os400/db2i/lib/db2');
    var xt = require('/QOpenSys/QIBM/ProdData/OPS/Node4/os400/xstoolkit/lib/itoolkit.js');
}
else {
	var db = require('/QOpenSys/QIBM/ProdData/Node/os400/db2i/lib/db2');
    var xt = require('/QOpenSys/QIBM/ProdData/Node/os400/xstoolkit/lib/itoolkit.js');
}

var conn = new xt.iConn("*LOCAL");

var options = {
  key: fs.readFileSync('./ibmidash-key.pem'),
  cert: fs.readFileSync('./ibmidash-cert.pem')
}

var port_secure = process.argv[2] || 8443
var port_insecure = process.argv[3] || 8080
var host_name = process.argv[4] || os.hostname()

app.locals._      = require('underscore');
app.locals._.str  = require('underscore.string');

const dbconn = new db.dbconn()
dbconn.conn("*LOCAL")
var stmt = new db.dbstmt(dbconn)

//db.debug(true);
//db.init()
//db.conn("*LOCAL")

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'})
})
app.get('/users', function (req, res) {
  var sql =
    "SELECT * FROM QSYS2.USER_STORAGE AS US" +
    " LEFT JOIN QSYS2.USER_INFO AS UI on UI.AUTHORIZATION_NAME=US.AUTHORIZATION_NAME"
    stmt = new db.dbstmt(dbconn);
  stmt.exec(sql, function(results) {
    res.render('users', { title: 'Users', results: results})
  })
})
app.get('/user/:id', function (req, res) {
  var sql =
    "SELECT * FROM QSYS2.USER_STORAGE AS US" +
    " LEFT JOIN QSYS2.USER_INFO AS UI on UI.AUTHORIZATION_NAME=US.AUTHORIZATION_NAME" +
    " WHERE US.AUTHORIZATION_NAME='" + req.params.id + "'"
    stmt = new db.dbstmt(dbconn);
    stmt.exec(sql, function(result) {
    res.render('user', { result: result[0]})
  })
})
app.get('/file_waste_schemas', function (req, res) {
  var sql =
    "select objname, objowner, objtext from table(QSYS2.object_statistics('QSYS      ', 'LIB       ')) libs order by  1"
	  stmt = new db.dbstmt(dbconn);
  stmt.exec(sql, function(results) {
    res.render('file_waste_schemas', { title: 'File waste: Select schema', results: results})
  })
})
app.get('/file_waste/:id', function (req, res) {
  var sql =
    "select a.system_table_name, a.table_text, b.system_table_member, " +
	"       date(b.last_change_timestamp) as last_changed_date, date(b.last_used_timestamp) as last_used_date, " +
	"       number_rows, number_deleted_rows, " +
	"       bigint( 100 * number_deleted_rows / max( number_rows+number_deleted_rows, 1 ) ) as Percent_Deleted, " +
	"       data_size, " +
	"       bigint( data_size * float( number_deleted_rows ) / max( number_rows+number_deleted_rows, 1 ) ) as Deleted_Space " +
	"  from qsys2.systables a join qsys2.syspartitionstat b on (a.system_table_name, a.system_table_schema) = (b.system_table_name, b.system_table_schema) " +
	" where a.table_schema = '" + req.params.id + "' " +
	"       and table_type in ('T', 'P') and table_type in ('T', 'P') and file_type = 'D' and number_deleted_rows > 0 " +
	" order by Deleted_Space desc" +
	" fetch first 100 rows only"
	stmt = new db.dbstmt(dbconn);
	  stmt.exec(sql, function(results) {
    res.render('file_waste', { title: 'File waste space information - library ' + req.params.id, results: results})
  })
})

app.get('/advised_index_schemas', function (req, res) {
  var sql =
    "select dbname, count(*) as nbradv" +
	"  from qsys2.sysixadv" +
	" group by dbname" +
	" order by nbradv desc" +
	" fetch first 100 rows only"
	stmt = new db.dbstmt(dbconn);
	  stmt.exec(sql, function(results) {
    res.render('advised_index_schemas', { title: 'Advised Indexes: Select schema', results: results})
  })
})

app.get('/advised_indexes/:id', function (req, res) {
  var sql =
    "select dbname, tbname, index_type, nlssname, timesadv, lastadv, keysadv" +
	"  from qsys2.sysixadv" +
	" where dbname = '" + req.params.id + "'" +
	" order by tbname, timesadv desc"
	stmt = new db.dbstmt(dbconn);
	  stmt.exec(sql, function(results) {
    res.render('advised_indexes', { title: 'Advised Indexes for ' + req.params.id, results: results})
  })
})

app.get('/wrkactjob', function (req, res) {
  res.render('wrkactjob', { title: 'WRKACTJOB'})
})

app.get('/jobs_splf/:splfname', function (req, res) {
  var title = "Spoolfile storage by job"
  var sql =
    "select substr( JOB_NAME, locate_in_string( JOB_NAME, '/', 1, 2 ) + 1 ) as JOBNAME, " +
	"       substr( JOB_NAME, locate_in_string( JOB_NAME, '/', 1, 1 ) + 1, locate_in_string( JOB_NAME, '/', 1, 2) - locate_in_string( JOB_NAME, '/', 1, 1) - 1 ) as JOBUSER, " +
	"       substr( JOB_NAME, 1, locate_in_string( JOB_NAME, '/', 1, 1) - 1 ) as JOBNBR, " +
	"       count(*) as SPLF_COUNT, " +
	"       sum(cast(SIZE as bigint)) * 1024 as SPLF_SIZE, " +
    "       char(date(max(CREATE_TIMESTAMP))) concat ' ' concat char(time(max(CREATE_TIMESTAMP))) as NEWEST_SPLF " +
    "  from table(QSYS2.OBJECT_STATISTICS('*ALL      ', '*LIB')) a, " +
    "       table(QSYS2.OBJECT_STATISTICS(a.OBJNAME, '*OUTQ')) b, " +
    "       table(QSYS2.OUTPUT_QUEUE_ENTRIES(a.OBJNAME, b.OBJNAME, '*NO')) c "
  if ( req.params.splfname != '' && req.params.splfname != '*ALL' ){
      title += " - " + req.params.splfname
      sql += "where SPOOLED_FILE_NAME = '" + req.params.splfname + "'"
  }
  sql +=
    " group by JOB_NAME " +
    " order by 5 desc " +
    " fetch first 100 rows only"
    stmt = new db.dbstmt(dbconn);
	  stmt.exec(sql, function(results) {
    res.render('jobs_splf', { title: title, results: results })
  })
})


app.get('/splf_stg', function (req, res) {
  var title = "Spoolfile storage"
  var sql =
    "select SPOOLED_FILE_NAME, count(*) as SPLF_COUNT, sum(cast(SIZE as bigint)) * 1024 as SPLF_SIZE" +
    "  from table(QSYS2.OBJECT_STATISTICS('*ALL      ', '*LIB')) a, " +
    "       table(QSYS2.OBJECT_STATISTICS(a.OBJNAME, '*OUTQ')) b, " +
    "       table(QSYS2.OUTPUT_QUEUE_ENTRIES(a.OBJNAME, b.OBJNAME, '*NO')) c " +
    " group by SPOOLED_FILE_NAME " +
    " order by 3 desc "
  stmt = new db.dbstmt(dbconn);stmt.exec(sql, function(results) {
    res.render('splf_stg', { title: title, results: results })
   })
 })

io.on( 'connection', function( socket ) {
  console.log( 'WRKACTJOB client connected' );
  var wrkactjob_itv = setInterval( function() {
    var sql = "SELECT JOB_NAME, AUTHORIZATION_NAME, ELAPSED_TOTAL_DISK_IO_COUNT, " +
			  " ELAPSED_CPU_PERCENTAGE " +
              " FROM TABLE(QSYS2.ACTIVE_JOB_INFO('NO','','','')) X" +
			  " ORDER BY ELAPSED_CPU_PERCENTAGE DESC" +
			  " FETCH FIRST 20 ROWS ONLY"
    stmt = new db.dbstmt(dbconn);stmt.exec(sql, function(results) {
      socket.emit('wrkactjob_update', results);
    })
  }, 2000);
  socket.on( 'disconnect', function() {
	  console.log( 'WRKACTJOB client disconnected' );
	  clearInterval( wrkactjob_itv );
  })
})


app.get('/ptf_group_info', function (req, res) {
  var title = "PTF Group info"
  var sql =
    "select PTF_GROUP_DESCRIPTION, PTF_GROUP_NAME, PTF_GROUP_LEVEL, PTF_GROUP_STATUS " +
    "  from QSYS2.GROUP_PTF_INFO " +
    " order by 2 desc fetch first 1 rows only "
  stmt = new db.dbstmt(dbconn);
  stmt.exec(sql, function(results) {
	  
    res.render('ptf_group_info', { title: title, results: results })
   });
 });
 
 
app.get('/sysdiskstat', function(req, res) {
    try {
        stmt = new db.dbstmt(dbconn);stmt.exec("SELECT PERCENT_USED FROM QSYS2.SYSDISKSTAT", function(results) {
        res.render('sysdiskstat', { title: 'SYSDISKSTAT', diskResults: results});
        //console.log(results);
        }); 
    }
    catch (err) {
        console.log(err);
    }
});

app.get('/SYSTEM_STATUS_INFO', function(req, res) {
    var title = "SYSTEM_STATUS_INFO"
    var sql = "SELECT * FROM QSYS2.SYSTEM_STATUS_INFO"
    var url = "https://www.ibm.com/developerworks/community/wikis/home?lang=en#!/wiki/IBM%20i%20Technology%20Updates/page/QSYS2.SYSTEM_STATUS_INFO"
    try {
        stmt = new db.dbstmt(dbconn);stmt.exec(sql, function(results) {
        res.render('table_view', { title: title, sql: sql, url: url, results: results});
        //console.log(results);
        }); 
    }
    catch (err) {
        console.log(err);
    }
});


app.get('/LICENSE_INFO', function(req, res) {
    var title = "LICENSE_INFO"
    var sql = "SELECT * FROM QSYS2.LICENSE_INFO"
    var url = "https://www.ibm.com/developerworks/community/wikis/home?lang=en#!/wiki/IBM%20i%20Technology%20Updates/page/QSYS2.LICENSE_INFO"
    try {
        stmt = new db.dbstmt(dbconn);stmt.exec(sql, function(results) {
        res.render('table_view', { title: title, sql: sql, url: url, results: results});
        //console.log(results);
        }); 
    };
    catch (err) {
        console.log(err);
    };
});

app.get('/JOURNAL_INFO', function(req, res) {
    var title = "JOURNAL_INFO"
    var sql = "SELECT * FROM QSYS2.JOURNAL_INFO"
    var url = "https://www.ibm.com/developerworks/community/wikis/home?lang=en#!/wiki/IBM%20i%20Technology%20Updates/page/QSYS2.JOURNAL_INFO%20view"
    try {
        stmt = new db.dbstmt(dbconn);stmt.exec(sql, function(results) {
        res.render('table_view', { title: title, sql: sql, url: url, results: results});
        //console.log(results);
        }); 
    }
    catch (err) {
        console.log(err);
    }
});

app.get('/USER_INFO', function(req, res) {
    var title = "USER_INFO"
    var sql = "SELECT * FROM QSYS2.USER_INFO"
    var url = "https://www.ibm.com/developerworks/community/wikis/home?lang=en#!/wiki/IBM%20i%20Technology%20Updates/page/QSYS2.USER_INFO%20catalog"
    try {
        stmt = new db.dbstmt(dbconn);stmt.exec(sql, function(results) {
        res.render('table_view', { title: title, sql: sql, url: url, results: results});
        //console.log(results);
        }); 
    }
    catch (err) {
        console.log(err);
    }
});

app.get('/TCPIP_INFO', function(req, res) {
    var title = "TCPIP_INFO"
    var sql = "SELECT * FROM QSYS2.TCPIP_INFO"
    var url = "https://www.ibm.com/developerworks/community/wikis/home?lang=en#!/wiki/IBM%20i%20Technology%20Updates/page/QSYS2.TCPIP_INFO%20view"
    try {
        stmt = new db.dbstmt(dbconn);stmt.exec(sql, function(results) {
        res.render('table_view', { title: title, sql: sql, url: url, results: results});
        //console.log(results);
        }); 
    }
    catch (err) {
        console.log(err);
    }
});

app.get('/NETSTAT_INFO', function(req, res) {
    var title = "NETSTAT_INFO"
    var sql = "SELECT * FROM QSYS2.NETSTAT_INFO"
    var url = "https://www.ibm.com/developerworks/community/wikis/home?lang=en#!/wiki/IBM%20i%20Technology%20Updates/page/QSYS2.NETSTAT_INFO"
    try {
        stmt = new db.dbstmt(dbconn);stmt.exec(sql, function(results) {
        res.render('table_view', { title: title, sql: sql, url: url, results: results});
        //console.log(results);
        }); 
    }
    catch (err) {
        console.log(err);
    }
});

app.get('/USER_STORAGE', function(req, res) {
    var title = "USER_STORAGE"
    var sql = "SELECT * FROM QSYS2/USER_STORAGE"
    var url = "https://www.ibm.com/developerworks/community/wikis/home?lang=en#!/wiki/IBM%20i%20Technology%20Updates/page/QSYS2.USER_STORAGE%20catalog"
    try {
        stmt = new db.dbstmt(dbconn);stmt.exec(sql, function(results) {
        res.render('table_view', { title: title, sql: sql, url: url, results: results});
        //console.log(results);
        }); 
    }
    catch (err) {
        console.log(err);
    }
});

app.get('/OUTPUT_QUEUE_INFO', function(req, res) {
    var title = "OUTPUT_QUEUE_INFO"
    var sql = "SELECT * FROM QSYS2.OUTPUT_QUEUE_INFO"
    var url = "https://www.ibm.com/developerworks/community/wikis/home?lang=en#!/wiki/IBM%20i%20Technology%20Updates/page/QSYS2.OUTPUT_QUEUE_INFO%20-%20View"
    try {
        stmt = new db.dbstmt(dbconn);stmt.exec(sql, function(results) {
        res.render('table_view', { title: title, sql: sql, url: url, results: results});
        //console.log(results);
        }); 
    }
    catch (err) {
        console.log(err);
    }
});

app.get('/SERVER_SBS_ROUTING', function(req, res) {
    var title = "SERVER_SBS_ROUTING"
    var sql = "SELECT * FROM QSYS2.SERVER_SBS_ROUTING"
    var url = "https://www.ibm.com/developerworks/community/wikis/home?lang=en#!/wiki/IBM%20i%20Technology%20Updates/page/QSYS2.SERVER_SBS_ROUTING%20-%20view"
    try {
        stmt = new db.dbstmt(dbconn);stmt.exec(sql, function(results) {
        res.render('table_view', { title: title, sql: sql, url: url, results: results});
        //console.log(results);
        }); 
    }
    catch (err) {
        console.log(err);
    }
});

app.get('/SYSTEM_VALUE_INFO', function(req, res) {
    var title = "SYSTEM_VALUE_INFO"
    var sql = "SELECT * FROM SYSTEM_VALUE_INFO"
    var url = "https://www.ibm.com/developerworks/community/wikis/home?lang=en#!/wiki/IBM%20i%20Technology%20Updates/page/QSYS2.SYSTEM_VALUE_INFO%20catalog"
    try {
        stmt = new db.dbstmt(dbconn);stmt.exec(sql, function(results) {
        res.render('table_view', { title: title, sql: sql, url: url, results: results});
        //console.log(results);
        }); 
    }
    catch (err) {
        console.log(err);
    }
});

app.get('/ACTIVE_JOB_INFO', function(req, res) {
    var title = "ACTIVE_JOB_INFO"
    var sql = "SELECT 8 FROM QSYS2.ACTIVE_JOB_INFO"
    var url = "https://www.ibm.com/developerworks/community/wikis/home?lang=en#!/wiki/IBM%20i%20Technology%20Updates/page/QSYS2.ACTIVE_JOB_INFO()%20-%20UDTF"
    try {
        stmt = new db.dbstmt(dbconn);stmt.exec(sql, function(results) {
        res.render('table_view', { title: title, sql: sql, url: url, results: results});
        //console.log(results);
        }); 
    }
    catch (err) {
        console.log(err);
    }
});

app.get('/GROUP_PROFILE_ENTRIES', function(req, res) {
    var title = "GROUP_PROFILE_ENTRIES"
    var sql = "SELECT * FROM QSYS2.GROUP_PROFILE_ENTRIES"
    var url = "https://www.ibm.com/developerworks/community/wikis/home?lang=en#!/wiki/IBM%20i%20Technology%20Updates/page/QSYS2.GROUP_PROFILE_ENTRIES%20%E2%80%93%20new%20security%20view"
    try {
        stmt = new db.dbstmt(dbconn);stmt.exec(sql, function(results) {
        res.render('table_view', { title: title, sql: sql, url: url, results: results});
        //console.log(results);
        }); 
    }
    catch (err) {
        console.log(err);
    }
});

app.get('/DRDA_AUTHENTICATION_ENTRY_INFO', function(req, res) {
    var title = "DRDA_AUTHENTICATION_ENTRY_INFO"
    var sql = "SELECT * FROM QSYS2.DRDA_AUTHENTICATION_ENTRY_INFO"
    var url = "https://www.ibm.com/developerworks/community/wikis/home?lang=en#!/wiki/IBM%20i%20Technology%20Updates/page/QSYS2.DRDA_AUTHENTICATION_ENTRY_INFO"
    try {
        stmt = new db.dbstmt(dbconn);stmt.exec(sql, function(results) {
        res.render('table_view', { title: title, sql: sql, url: url, results: results});
        //console.log(results);
        }); 
    }
    catch (err) {
        console.log(err);
    }
});

app.get('/ENVIRONMENT_VARIABLE_INFO', function(req, res) {
    var title = "ENVIRONMENT_VARIABLE_INFO"
    var sql = "SELECT * FROM QSYS2.ENVIRONMENT_VARIABLE_INFO"
    var url = "https://www.ibm.com/developerworks/community/wikis/home?lang=en#!/wiki/IBM%20i%20Technology%20Updates/page/QSYS2.ENVIRONMENT_VARIABLE_INFO%20-%20view"
    try {
        stmt = new db.dbstmt(dbconn);stmt.exec(sql, function(results) {
        res.render('table_view', { title: title, sql: sql, url: url, results: results});
        //console.log(results);
        }); 
    }
    catch (err) {
        console.log(err);
    }
});

// IBM i program/service call
app.get('/IBMi_program_call', function(req, res) {
    db.close()
    var title = "IBM i program/service call"
    var cmd = "QTOCNETSTS"
    var sysVal = "QCCSID";
        var errno = [
            [0, "10i0"],
            [0, "10i0", {"setlen":"rec2"}],
            ["", "7A"],
            ["", "1A"]
        ];
        var outBuf = [
            [0, "10i0"],     // [0] Bytes returned
            [0, "10i0"],     // [1] Bytes available
            [0, "10i0"],     // [2] TCP/IPv4 stack status
            [0, "10i0"],     // [3] How long active
            ["", "8A"],     // [4] When last started - date
            ["", "6A"],     // [5] When last started - time
            ["", "8A"],     // [6] When last ended - date
            ["", "6A"],     // [7] When last ended - time
            ["", "10A"],    // [8] Who last started - job name
            ["", "10A"],    // [9] Who last started - job user name
            ["", "6A"],     // [10] Who last started - job number
            ["", "16h"],    // [11] Who last started - internal job identifier
            ["", "10A"],    // [12] Who last ended - job name
            ["", "10A"],    // [13] Who last ended - job user name
            ["", "6A"],     // [14] Who last ended - job number
            ["", "16h"],    // [15] Who last ended - internal job identifier
            [0, "10i0"],     // [16] Offset to additional information
            [0, "10i0"],     // [17] Length of additional information
            [0, "10i0"],     // [18] Limited mode
            [0, "10i0"],     // [19] Offset to list of Internet addresses
            [0, "10i0"],     // [20] Number of Internet addresses
            [0, "10i0"],     // [21] Entry length for list of Internet addresses
            [0, "10i0"],     // [22] DNS protocol
            [0, "10i0"],     // [23] Retries
            [0, "10i0"],     // [24] Time interval
            [0, "10i0"],     // [25] Search order
            [0, "10i0"],     // [26] Initial domain name server
            [0, "10i0"],     // [27] DNS listening port
            ["", "64A"],    // [28] Host name
            ["", "255A"],  // [29] Domain name
            ["", "1A"],     // [30] Reserved
            ["", "256A"],  // [31] Domain search list
        ];
        var pgm = new xt.iPgm("QTOCNETSTS", {"lib":"QSYS","func":"QtocRtvTCPA"});
        pgm.addParam(outBuf, {"io":"out", "len":"rec1"});
        pgm.addParam(0, "10i0", {"setlen":"rec1"});
        pgm.addParam("TCPA0300", "8A");
        pgm.addParam(errno, {"io":"both", "len" : "rec2"});
        conn.add(pgm);
        conn.run(function(results) {
            var pram1 = "Domain: "+xt.xmlToJson(results)[0].data[29].value
            var pram2 = "Host: "+xt.xmlToJson(results)[0].data[28].value
            res.render('node_toolkit', { title: title, cmd: cmd, pram1: pram1, pram2: pram2})
            db.open()
        },true);
});

// CL Command
app.get('/IBMi_cl_command', function(req, res) {
    db.close()
    var title = "IBM i CL Command"
    var cmd = "RTVJOBA USRLIBL(?) SYSLIBL(?)"
    conn.add(xt.iCmd("RTVJOBA USRLIBL(?) SYSLIBL(?)"));
    conn.run(function(results) {
        var pram1 = "USRLIBL: " + xt.xmlToJson(results)[0].data[0].value 
        var pram2 = "SYSLIBL: " + xt.xmlToJson(results)[0].data[1].value
        res.render('node_toolkit', { title: title, cmd: cmd, pram1: pram1, pram2: pram2})
        db.open()
    },true);
});

function testQurey() {
    // QShell Command (PASE) 
    conn.add(xt.iSh("system -i wrksyssts"));
    conn.run(function(results) {
        console.log(results);
    },true);
}


http.createServer(function(req, res) {
  var new_loc = 'https://' + host_name + ':' + port_secure
  console.log('new_loc:%s', new_loc)
  res.writeHead(301,
    {Location: new_loc}
  );
  res.end();
}).listen(port_insecure);

var httpsServer = https.createServer(options, app).listen(port_secure);

io.attach(httpsServer)

