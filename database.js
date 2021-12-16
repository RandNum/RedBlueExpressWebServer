var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE cookie (
            id INTEGER PRIMARY KEY,
            audience text, 
            count INTEGER  
            )`,
        (err) => {
            if (err) {
                // Table already created
                // console.error(err.message)
            }else{
                // Table just created, creating some rows
                console.log('Inserting sample rows into cookie')
                var insert = 'INSERT INTO cookie (id, audience, count) VALUES (?,?,?)'
                db.run(insert, ["1","red",1])
                db.run(insert, ["2","blue",1])
            }
        });  
    }
});


module.exports = db

