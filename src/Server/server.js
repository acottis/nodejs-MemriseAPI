const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const helmet = require('helmet')

const valid = require('./js/isValid')
const mongodb = require('./js/mongodb')
const constant = require('./config/constants')
const mem_api = require('./MemriseAPI/app')

// Set up express and configure it
const app = express()

app.use(helmet())
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
app.get("/api/profile", async (req, res) => {
    const id = req.signedCookies['id']
    try {
        let result = await mongodb.checkCookie(id)
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Expires", "0");
        res.json(result['profile']['name'])
    }
    catch (error) {
        res.status(401)
        res.json({
            message: error['message']
        })
    }
})

// Handles Authentication
app.post("/api/login", (req, res) => {
    //console.log(req.headers.cookie)
    if (valid.login(req.body)) {
        const creds = {
            name: req.body.name.toString().toLowerCase().trim(),
            password: req.body.password.toString().trim(),
            created: new Date()
        }
        //PROMISES ARE GOOD
        mongodb.loginUserPromise(creds).then(result => {
            console.log(result['message'])
            if (result['success'] == true) {
                res.status(200)
                // CHANGE THE VAL
                res.cookie(name = "id", val = result['id'], { signed: true })
                res.json({
                    message: result['message'],
                })
            }
            else {
                res.status(422)
                res.json({
                    message: result['message']
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
    console.log("hello World")
})


//MEMRISE PATHS
// Adds memrise credentials to the database (PLAINTEXT!!!!!!!!!!!)
app.post("/api/memrise/creds", async (req, res) => {
    const id = req.signedCookies['id']
    try {
        let result = await mongodb.checkCookie(id)
    }
    catch (e) {
        res.status(401)
        res.json({
            message: result['message']
        })
        return
    }
    try {
        let result = await mongodb.addMemriseCreds(id, req.body)
        console.log(result)
        res.status(200)
        res.json({
            message: result['message']
        })
    }
    catch (e) {
        res.status(401)
        res.json({
            message: "Something went wrong"
        })
    }
})

// Returns list of courses
app.get("/api/memrise/courses", async (req, res) => {
    const id = req.signedCookies['id']
    try {
        let result = await mongodb.checkCookie(id)

        try {
            // let result = await mongodb.addMemriseCreds(id, req.body)
            // console.log(result)
            const api = new mem_api.MemriseAPI()
            const courses = await api.get_course_list(id)
            res.status(200)
            res.json(courses)

            // Add them to database
            mongodb.addCourses(id, courses)
        }
        catch (e) {
            console.log(e)
            res.status(500)
            res.json({
                message: "Something went wrong"
            })
        }
    }
    catch (e) {
        res.status(401)
        res.json({
            message: result['message']
        })
    }
})

// Returns data from a course ID
app.get("/api/memrise/course", async (req, res) => {
    const id = req.signedCookies['id']
    try {
        let result = await mongodb.checkCookie(id)

        try {
            const api = new mem_api.MemriseAPI()
            const words = await api.get_word_list(id, req.query.url)
            res.status(200)
            res.json(words) 
            // let result = await mongodb.addMemriseCreds(id, req.body)
            // console.log(result)
            // const api = new mem_api.MemriseAPI(id)
            // const courses = await api.wrapper()
            // res.status(200)
            // res.json(courses)

            // // Add them to database
            // mongodb.addCourses(id, courses)
        }
        catch (e) {
            console.log(e)
            res.status(500)
            res.json({
                message: "Something went wrong"
            })
        }
    }
    catch (e) {
        res.status(401)
        res.json({
            message: result['message']
        })
    }
})


