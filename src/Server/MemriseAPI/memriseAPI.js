
const constant = require('../config/constants')
const secret = require('../config/secrets')

const qs = require('qs');
const superagent = require('superagent');
const cheerio = require('cheerio')


//LOGIN TO MEMRISE

class MemriseAPI {

    constructor(course) {
        this.course_url = constant.MEMRISE_BASE_URL + 'course/5757638/daneoneun-sinaessi-wihae-baeugi-pilyohaeyo/'
        this.login_url = constant.MEMRISE_BASE_URL + constant.MEMRISE_LOGIN_PATH
        this.get_course_url = constant.MEMRISE_BASE_URL + constant.MEMRISE_GET_COURSES

        this.middlwaretoken = ''
        this.data = ''
        this.agent = superagent.agent().set('Referer', this.login_url)

    }

    // Logins in and gives this.agent all the cookies
    // TODO: return some kind of success or fail status
    async login() {
        try {
            const login_page = await this.agent.get(this.login_url)

            const raw_csrf = login_page.text.match(/value="\S{10,}/gi) + ""
            this.middlwaretoken = raw_csrf.split(/"/)[1]
            this.data = qs.stringify({
                'username': secret.MEMRISE_USERNAME,
                'password': secret.MEMORISE_PASSWORD,
                'csrfmiddlewaretoken': this.middlwaretoken,
            })

        } catch (err) {
            console.error(err);
        }
        try {
            const logged_in_page = await this.agent.post(this.login_url).send(this.data)
            //console.log(logged_in_page)
            console.log("finished login")
        }
        catch (err) {
            console.log(err)
        }
    }

    // Tests that I can get to a page with authorization
    async test() {
        try {
            const page = await this.agent.get(this.course_url)
            console.log(page)
        }
        catch (err) {
            // console.log(err)
        }
    }

    async getCourses() {
        try {
            const courses = await this.agent
                .get(this.get_course_url)
                .query({ courses_filter: 'learning', category_id: 8 })

            for (const course in courses.body['courses']) {
                console.log(courses.body['courses'][course]['slug'])
                console.log(courses.body['courses'][course]['url'])
            }

        }
        catch (err) {
            console.log(err)
        }
    }

    // Grabes the English words and their translations from given memrise course
    async getCourseWords() {
        try {
            const page = await this.agent.get(this.course_url)

            const $ = cheerio.load(page.text)

            const kr_words = []
            const en_words = []
            const kr_column = $('.col_a.col.text')
                .each(function (i, div) {
                    kr_words.push($(div).text())
                })
            const en_column = $('.col_b.col.text')
                .each(function (i, div) {
                    en_words.push($(div).text())
                })
            console.log(kr_words)
            console.log(en_words)

        }
        catch (err) {
            console.log(err)
        }
    }

    async wrapper() {
        await this.login()
        // await this.getCourseWords()
        // await this.test()
        await this.getCourses()
    }

}


api = new MemriseAPI()

api.wrapper()
