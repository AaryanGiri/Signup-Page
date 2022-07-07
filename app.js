const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",(req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/",(req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    // console.log(firstName, lastName, email);
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us12.api.mailchimp.com/3.0/lists/3c140d6bbe"

    const option = {
        method: "POST",
        auth: "aaryan:1a98389e4eab33f7b6cc19a408c54600-us12"
    }

    const request = https.request(url, option, response => {

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", data => {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
    
});

app.post("/failure", (req, res)=>{
    res.redirect("/")
})

app.listen(3000,()=>{
    console.log("running on 3000");
});

// 1a98389e4eab33f7b6cc19a408c54600-us12
// 3c140d6bbe