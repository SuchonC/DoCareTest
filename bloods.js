const axios = require('axios');
const { send } = require('process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function send_iot_gateway(data, op){
    if(op == 1) { //BP
        send_bloodpressure(data, "63001416")
    }else if(op == 2){ //BG
        send_bloodglucose(data, "6300142F")
    }
}

function gen_bloodpressue(){
    return {
        sys: Math.round(getRandomArbitrary(110, 120)),
        dia: Math.round(getRandomArbitrary(70, 80)),
        pul: Math.round(getRandomArbitrary(60, 100))
    }

    // return {sys: 20, dia: 50, pul: 100}
}

function gen_bloodglucose(){
    return {
        glu: Math.round(getRandomArbitrary(170, 200)),
        meal: Math.round(getRandomArbitrary(0, 4))
    }
    // return {glu: 1, meal: 2}
}

function send_bloodpressure(input, mac){
    var body = {
        "Content-Type": "application/json",
        "X-Signature": "XSIG",
        mac: mac,
        data: [
            {
                type: "190002",
                values: {
                    sys: input.sys,
                    dia: input.dia,
                    pul: input.pul
                }
            }
        ]
      }

    var config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer VzltaDd3PT06U0dlb2hQdzQ4dTUyZjIwN3kwSmJzNFF2aWJ6SkxISzRpZkxPQ2s2c0NmWg=="  
            }
    }
    
    var api_body = {
        message: "Systolic: " + input.sys + "\nDiastolic: " + input.dia + "\nPulse: " + input.pul,
        token: "SGeohPw48u52f207y0Jbs4QvibzJLHK4ifLOCk6sCfZ"
    }

    axios.post("http://localhost/bloodpressure", body)
        .then(res => {
            // console.log(res.statusText)

            axios.post("https://docareportal.com/api/line/notify/send", api_body, config)
                // .then(result => console.log(result.statusText))
                .catch(err => console.log(err))
        })
        .catch(err => console.log("ERROR GEN TEMP"))
}

function send_bloodglucose(input, mac){
    var body = {
        "Content-Type": "application/json",
        "X-Signature": "XSIG",
        mac: mac,
        data: [
            {
                type: "190003",
                values: {
                    glu: input.glu,
                    meal: input.meal
                }
            }
        ]
      }

    var _meal = ''

    if(input.meal == 0) _meal = "Before"
    else if(input.meal == 1) _meal = "After"
    else if(input.meal == 2) _meal = "Fasting"
    else if(input.meal == 3) _meal = "Others"
    else if(input.meal == 4) _meal = "Unspecified"

    var config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer VzltaDd3PT06U0dlb2hQdzQ4dTUyZjIwN3kwSmJzNFF2aWJ6SkxISzRpZkxPQ2s2c0NmWg=="  
            }
    }
    
    var api_body = {
        message: "Glucose: " + input.glu + "\nMeal: " + _meal,
        token: "SGeohPw48u52f207y0Jbs4QvibzJLHK4ifLOCk6sCfZ"
    }

    axios.post("http://localhost/bloodglucose", body)
        .then(res => {
            // console.log(res.statusText)

            axios.post("https://docareportal.com/api/line/notify/send", api_body, config)
                // .then(result => console.log(result.statusText))
                .catch(err => console.log(err))
        })
        .catch(err => console.log("ERROR GEN TEMP"))
}

function recursive(){
    rl.question('What Operation (1.BP 2.BG): ', (op) => {
        console.log("You answered: " + op);
        recursive()

        if(op == 1) send_iot_gateway(gen_bloodpressue(), 1)
        else if(op == 2) send_iot_gateway(gen_bloodglucose(), 2)
        // rl.close();  
      });
}

recursive()