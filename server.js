// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")
//var md5 = require("md5") //May need later if we add any encrypted values


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());
app.options('*', cors());


// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// Insert here other API endpoints

// Get all cookies
app.get("/api/cookies", (req, res, next) => {
    var sql = "select * from cookie"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

//Get cookie
app.get("/api/cookie/:id", (req, res, next) => {
    var sql = "select * from cookie where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

//Post values
app.post("/api/cookie/", (req, res, next) => {
    var errors=[]
    if (!req.body.id){
        errors.push("No id specified");
    }
    if (!req.body.audience){
        errors.push("No audience specified");
    }
    if (!req.body.count){
        errors.push("No count specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        id: req.body.id,
        audience: req.body.audience,
        count : req.body.count
    }
    var sql ='INSERT INTO cookie (id, audience, count) VALUES (?,?,?)'
    var params =[data.id, data.audience, data.count]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

//update cookie 
app.patch("/api/cookie/:id", (req, res, next) => {
    var data = {
        count: req.body.count,
    }
    console.log("updating record " + req.params.id)
    db.run(
        `UPDATE cookie set  
           count = ? 
           WHERE id = ?`,
        [data.count, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
})

//delete cookie (implement later if needed)
app.delete("/api/cookie/:id", (req, res, next) => {
    db.run(
        'DELETE FROM cookie WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});

