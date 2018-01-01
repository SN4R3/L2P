//Open DB
var db = null;
db = openDatabase('ldriverdb', '1.0', 'Learner DB', 2 * 1024 & 1024);

//Create tables
db.transaction(function(trans) {
    trans.executeSql(`CREATE TABLE IF NOT EXISTS tbllogs 
        (logid INTEGER PRIMARY KEY AUTOINCREMENT, 
        logDate text, logStartTime text, logEndTime text, 
        nightDrivingMins integer, totalTime integer, totalKms integer,
        carRego text, parking integer, weather text, light text, traffic text, 
        roadType text, supName text);`);

    trans.executeSql(`CREATE TABLE IF NOT EXISTS 
    tblsup (supId INTEGER PRIMARY KEY AUTOINCREMENT,
        name text, driverNo text, phone integer, 
        expiry text, sig text);`);

    trans.executeSql(`CREATE TABLE IF NOT EXISTS 
        tbllrner (lrnerid INTEGER PRIMARY KEY AUTOINCREMENT, 
        totalHrs integer, recPerm text, 
        planPPerm text, under21 integer);`);

});

//SQL functions
function insertRecord(tblName, columns, records) {
    var sqlQuery;
    var cols = "";
    var vals = "";
    //Convert each column index parsed into a string to use in sql statement
    for (var i = 0; i < columns.length; i++) {
        cols += columns[i];
        vals += "?";
        if ((i + 1) !== columns.length) { //Not the last column
            cols += ",";
            vals += ",";
        }
    }
    sqlQuery = `INSERT INTO ${tblName} (${cols}) VALUES (${vals});`;
    db.transaction(function(trans) {
        trans.executeSql(sqlQuery, records,
            function success() {
                //alert("Record Added");
            },
            onError
        );
    });
}
//Selects records based on arguements, return the result as args in the callback func
function selectRecords(tblname, cols, callback) {
    var output = "";
    var sqlQuery = `SELECT ${cols} FROM ${tblname}`;
    db.transaction((trans) => {
        trans.executeSql(sqlQuery, [], (trans, res) => {
            callback(res);
        });
    })
}

function deleteRecord(tblname, keycol, keyval) {
    var sqlQuery = `DELETE FROM ${tblname} WHERE ${keycol} = ?;`;
    db.transaction((trans) => {
        trans.executeSql(sqlQuery, [keyval], () => {
            alert(`Record deleted`);
        }, onError);
    });
}

function updateRecord(tblname, cols, vals, keyname) {
    var sqlQuery = `UPDATE ${tblname} SET `;
    //Convert each column & value indexs parsed into a string to use in sql statement
    for (var i = 0; i < cols.length; i++) {
        sqlQuery += cols[i] + '= ?';
        if ((i + 1) !== cols.length) { //Not the last column
            sqlQuery += ",";
        }
    }
    sqlQuery += ` WHERE ${keyname} = ?;`;
    console.log(sqlQuery);
    db.transaction((trans) => {
        trans.executeSql(sqlQuery, vals, () => {
            //alert(`Record updated`);
        }, onError);
    });
}

function onError(err) {

    switch (err.code) {
        case 0:
            alert("Non database error: " + err.message);
            break;
        case 1:
            alert("Some database error: " + err.message);
            break;
        case 2:
            alert("Wrong database version: " + err.message);
            break;
        case 3:
            alert("Data set too large to return from query: " + err.message);
            break;
        case 4:
            alert("Storage limit exceeded: " + err.message);
            break;
        case 5:
            alert("Lock contention error: " + err.message);
            break;
        case 6:
            alert("Constraint failure:  " + err.message);
            break;
        default:
            alert("Error: " + err.code + " " + err.message);
            break;
    }

}