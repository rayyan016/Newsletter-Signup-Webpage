const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { dirname } = require("path");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/", function(req,res){

    const fName = req.body.firstName;
    const sName = req.body.secondName;
    const emailId = req.body.emailId;

    const data = {
        members : [
            {
                email_address: emailId,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: sName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us11.api.mailchimp.com/"; //Append personal mail list id
    const options = {
    method: "POST",
    auth: "#" //Insert authorisation key
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function(){
    console.log("Server running on port 3000");
})
