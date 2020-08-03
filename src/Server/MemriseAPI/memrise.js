const express = require('express')
const mongodb = require('../js/mongodb')
const mem_api = require('./app')

const router = express.Router()


//MEMRISE PATHS
// Adds memrise credentials to the database (PLAINTEXT!!!!!!!!!!!)
router.post("/creds", async (req, res) => {
    const id = req.signedCookies['id']
    try {
        let result = await mongodb.addMemriseCreds(id, req.body)
        console.log(result)
        res.status(200)
        res.json({
            message: result['message']
        })
    }
    catch (e) {
        res.status(500)
        res.json({
            message: "Something went wrong"
        })
    }
})

// Returns list of courses
router.get("/courses", async (req, res) => {
    const id = req.signedCookies['id']
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

})

// Returns data from a course ID
router.get("/course", async (req, res) => {
    const id = req.signedCookies['id']
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

})

module.exports = {
    router
}