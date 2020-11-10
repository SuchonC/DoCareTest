var axios = require('axios')

function send_iot_gateway(){
    
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function gen_bloodglucose(){
    return {
        glu: Math.round(getRandomArbitrary(170, 200)),
        meal: Math.round(getRandomArbitrary(0, 4))
    }
    // return {glu: 1, meal: 2}
}

function gen_temp(){
    return {
        temp: Math.round(getRandomArbitrary(28, 35)),
        humid: Math.round(getRandomArbitrary(35, 50))
    }
    // return {temp: 20, humid: 50}
}

function gen_bloodpressue(){
    return {
        sys: Math.round(getRandomArbitrary(110, 120)),
        dia: Math.round(getRandomArbitrary(70, 80)),
        pul: Math.round(getRandomArbitrary(60, 100))
    }

    // return {sys: 20, dia: 50, pul: 100}
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
            console.log(res.statusText)

            axios.post("https://docareportal.com/api/line/notify/send", api_body, config)
                .then(result => console.log(result.statusText))
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
            console.log(res.statusText)

            axios.post("https://docareportal.com/api/line/notify/send", api_body, config)
                .then(result => console.log(result.statusText))
                .catch(err => console.log(err))
        })
        .catch(err => console.log("ERROR GEN TEMP"))
}

function send_temp(input, mac){
    var body = {
        "Content-Type": "application/json",
        "X-Signature": "XSIG",
        mac: mac,
        data: [
            {
                type: "190005",
                values: {
                    temp: input.temp,
                    humid: input.humid
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
        message: "Temperature: " + input.temp + "\nHumidity: " + input.humid,
        token: "SGeohPw48u52f207y0Jbs4QvibzJLHK4ifLOCk6sCfZ"
      }

    axios.post("http://localhost/thermometer", body)
        .then(res => {
            console.log(res.statusText)
            axios.post("https://docareportal.com/api/line/notify/send", api_body, config)
                .then(result => console.log(result.statusText))
                .catch(err => console.log(err))
        })
        .catch(err => console.log("ERROR GEN TEMP"))

    
}

function timeout() {
    setTimeout(function () {
        send_temp(gen_temp(), "63001416")
        timeout();
    }, 10000);
}

timeout()

// send_bloodglucose(gen_bloodglucose(), "6300142F")
// send_bloodpressure(gen_bloodpressue(), "63001416")