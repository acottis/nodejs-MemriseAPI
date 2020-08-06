const express = require('express')
const mongodb = require('../js/mongodb')
const mem_api = require('./api')
const constant = require('../config/constants')

const router = express.Router()


// Cleans the inputs to add words to a list and returns a wordlist and URL
const clean_upload_input = (body, course_list) => {
    let url = ''
    let wordlist = []
    for (course in course_list) {
        if (course_list[course].name === body.course)
            url = course_list[course].url
    }
    // Removes the newlines and puts it into array
    wordlist = body.wordlist.split("\r\n")
    // Gets rid of whitespaces
    wordlist = wordlist.map(word => word.trim())
    // Gets rid of blank rows
    wordlist = wordlist.filter(word => {
        return word != null && word != ''
    })
    return {wordlist: wordlist, url: url}
}

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

// Upload word list
router.post("/upload", async (req, res) => {
    const id = req.signedCookies['id']
    try {
        const profile = await mongodb.getProfile(id)
        const result = clean_upload_input(req.body, profile.memrise_courses)

        // Sends the request to memrise and papago
        const api = new mem_api.MemriseAPI()
        await api.upload_word_list(result.wordlist, result.url, constant.TTS_VOICE, constant.TTS_SPEED, id)

        res.status(200)
        res.json({ message: 'hello' })

    }
    catch (error) {
        console.log(error)
        res.status(500)
        res.json(error)
       // res.json({message: "Something went wrong"})
    }
})

// Returns list of courses if pass renew=true it will go grab them again from the website, else from local db
router.get("/courses", async (req, res) => {
    const id = req.signedCookies['id']

    if (req.query.renew === 'false') {

        const profile = await mongodb.getProfile(id)
        const courses = profile.memrise_courses
        res.status(200)
        res.json(courses)
    }

    if (req.query.renew === 'true') {
        try {
            const api = new mem_api.MemriseAPI()
            const courses = await api.get_course_list(id)
            res.status(200)
            res.json(courses)

            // Add them to database
            mongodb.addCourses(id, courses)
        }
        catch (e) {
            // console.log(e)
            res.status(500)
            res.json({
                message: "Something went wrong"
            })
        }
    }
})

// Returns data from a course ID
router.get("/getwordlist", async (req, res) => {
    const id = req.signedCookies['id']

    try {
        const api = new mem_api.MemriseAPI()
        const words = await api.get_word_list(id, req.query.url)
        res.status(200)
        res.json(words)

    }
    catch (error) {
        //console.log(e)
        res.status(500)
        res.json({
            message: "Something went wrong"
        })
    }

})

module.exports = {
    router
}