const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser');

const valid = require('./js/isValid')
const mongodb = require('./js/mongodb')
const constant = require('./js/constants')

// Set up express and configure it
const app = express()
app.use(cors({
    origin: true,
    credentials: true
}))
app.use(express.json())
//app.use(morgan('dev'));
app.use(cookieParser(constant.COOKIE_SECRET));

// listen for new requests
app.listen(constant.PORT, () => {
    console.log("Listening on: " + constant.API_URL + ":" + constant.PORT)
})


// Test URL
app.get("/api", (req, res) => {
    console.log("안녕!")
    res.cookie("Test", "test")
    res.json({
        message: "안녕!"
    })
})

// Returns profile information
app.get("/api/profile", (req, res) => {
    id = req.signedCookies['id']
    console.log(id)
    if (id == null) {
        res.status(401)
        res.json({
            message: "Access denied"
        })
    }
    else {
        mongodb.getProfile(name = id).then(profile => {
            // These headers prevent access to cached content with reauth
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            res.setHeader("Expires", "0");
            res.json(profile)
        })
    }
})

// Handles Authentication
app.post("/api/login", (req, res) => {
    //console.log(req.headers.cookie)
    if (valid.login(req.body)) {
        const creds = {
            name: req.body.name.toString().toLowerCase().trim(),
            password: req.body.password.toString(),
            created: new Date()
        }
        //PROMISES ARE GOOD
        mongodb.loginUserPromise(creds).then(result => {
            console.log("after calling mongo")
            //console.log(result)
            if (result == true) {
                res.status(200)
                // CHANGE THE VAL
                res.cookie(name = "id", val = creds.name, { signed: true })
                res.json({
                    message: "Sucessful Login/Account Created",
                })
            }
            else {
                res.status(422)
                res.json({
                    message: "Wrong password"
                })
            }
        })
    }
    else {
        res.status(422)
        res.json({
            message: "Invalid Data Recieved"
        })
    }
})

// Logs out by deleting cookie
app.post("/api/logout", (req, res) => {
    res.status(200)
    res.clearCookie('id', { signed: true })
    res.json({
        message: "Logged out successful"
    })
})



