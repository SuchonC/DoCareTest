// This is for Git testing
// Testing again
// Testing 3 - for git commit -a to see if this file will be staged or not -> it should 
var express = require('express')
var mysql = require('mysql')
var mongoose = require('mongoose')
var app = express()

// -----------------------MySQL----------------------------------------------
// var con = mysql.createConnection({ // remote root login disabled
// 	host: 'localhost',
// 	user: 'foke',
// 	password: '0000000000' //0000000000
// })

// con.connect((err) => {
// 	if(err) throw err // means log an err an exit?
// 	else console.log("MYSQL CONNECTED")
// })


// q1 = "USE docare"
// q2 = "SELECT * FROM thermometer"

// con.query(q1, (err, result) => {
//     if(err) throw err
//     console.log(result)
// })
// ------------------------------------------------------------------------------

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/docare");

var thermometerSchema = new mongoose.Schema({
	mac: String,	
    temp: Number,
    humid: Number
});

var bloodglucoseSchema = new mongoose.Schema({
	mac: String,	
    blu: Number,
    meal: Number
});

var bloodpressureSchema = new mongoose.Schema({
	mac: String,	
    sys: Number,
    dia: Number,
    pul: Number
});

var Thermometer = mongoose.model("Thermometer", thermometerSchema);
var Bloodglucose = mongoose.model("Bloodglucose", bloodglucoseSchema);
var Bloodpressure = mongoose.model("Bloodpressure", bloodpressureSchema);

function get_from_thermometer(){
    return new Promise((resolve, reject) => {
        Thermometer.find({}, (err, res) => {
            resolve(res)
        })
    })
}

function get_from_bloodglucose(){
    return new Promise((resolve, reject) => {
        Bloodglucose.find({}, (err, res) => {
            resolve(res)
        })
    })
}

function get_from_bloodpressure(){
    return new Promise((resolve, reject) => {
        Bloodpressure.find({}, (err, res) => {
            resolve(res)
        })
    })
}

// function get_all(){
//     return new Promise((resolve, reject) => {
//         var out = []

//         Thermometer.find({}, (err, res) => out.push(res))
//     })
// }

app.use(express.json())

app.post('/thermometer', (req, res) => {
    console.log(req.body.data)
    Thermometer.create({
        mac: req.body.mac,
        temp: req.body.data[0].values.temp,
        humid: req.body.data[0].values.humid
    })
    // Thermometer
    res.send("OK")
})

app.post('/bloodglucose', (req, res) => {
    console.log(req.body.data)
    Bloodglucose.create({
        mac: req.body.mac,
        glu: req.body.data[0].values.glu,
        meal: req.body.data[0].values.meal
    })
    res.send("OK")
})

app.post('/bloodpressure', (req, res) => {
    console.log(req.body.data)
    Bloodpressure.create({
        mac: req.body.mac,
        sys: req.body.data[0].values.sys,
        dia: req.body.data[0].values.dia,
        pul: req.body.data[0].values.pul
    })
    res.send("OK")
})

app.get('/', (req, res) => {
    var out = []

    get_from_thermometer()
        .then(result1 => {
            out.push(result1)

            get_from_bloodglucose()
                .then(result2 => {
                    out.push(result2)

                    get_from_bloodpressure()
                        .then(result3 => {
                            out.push(result3)
                            res.send(out)
                        })
                })
        })

    // get_from_thermometer()
    //     .then(result => out.push(result))
    
    // get_from_bloodglucose()
    //     .then(result => out.push(result))

    // get_from_bloodpressure()
    //     .then(result => out.push(result))  

    // res.send(out)
})

app.listen(80, () => console.log("SERVER RUNNING"))
