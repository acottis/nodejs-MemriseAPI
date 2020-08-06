const constant = require('../config/constants')
const mongodb = require('../js/mongodb')
const { PapagoTTS } = require('./papago_tts')
const { Papago_Translate } = require('./papago_translate')

const qs = require('qs');
const superagent = require('superagent');

const cheerio = require('cheerio')

// // FOR TESTING
// const util = require('util');
// const fs = require('fs').promises

// //////////////////////


//LOGIN TO MEMRISE

class MemriseAPI {

    constructor(id) {
        this.login_url = constant.MEMRISE_BASE_URL + constant.MEMRISE_LOGIN_PATH
        this.get_course_url = constant.MEMRISE_BASE_URL + constant.MEMRISE_GET_COURSES
        this.bulk_add_url = constant.MEMRISE_BASE_URL + constant.MEMRISE_BULK_UPLOAD

        this.middlwaretoken = ''
        this.data = ''
        this.agent = superagent.agent()
            .set('Referer', this.login_url)
            .set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36')
        //  .set('user-agent', '<3 Thank you <3')


    }

    async get_login_creds(id) {
        console.log(id)
        this.profile = await mongodb.getProfile(id)
        const creds = this.profile['memrise']
        this.creds = creds
    }
    // Logins in and gives this.agent all the cookies
    // TODO: return some kind of success or fail status
    async login() {
        try {
            const login_page = await this.agent.get(this.login_url)

            const raw_csrf = login_page.text.match(/value="\S{10,}/gi) + ""
            this.middlwaretoken = raw_csrf.split(/"/)[1]
            this.data = qs.stringify({
                'username': this.creds['username'],
                'password': this.creds['password'],
                'csrfmiddlewaretoken': this.middlwaretoken,
            })

        } catch (err) {
            // console.error(err);
        }
        try {
            const logged_in_page = await this.agent
                .post(this.login_url)
                .send(this.data)

            console.log(`finished login with status ${logged_in_page.status}`)
        }
        catch (err) {
            // console.log(err)
        }
    }

    // Scrapes the course names and data
    async scrapeCourses() {

        let course_array = []

        try {
            const courses = await this.agent
                .get(this.get_course_url)
                .query({ courses_filter: 'learning', category_id: 8 })

            for (const course in courses.body['courses']) {
                // console.log(courses.body['courses'][course]['slug'])
                // console.log(courses.body['courses'][course]['url'])
                course_array.push({ id: courses.body['courses'][course]['id'], name: courses.body['courses'][course]['name'], url: courses.body['courses'][course]['url'] })
            }
            //console.log(course_array)
            return course_array

        }
        catch (err) {
            //console.log(err)
            return null
        }
    }

    // Grabes the English words and their translations from given memrise course
    async scrapeCourseWords(course) {
        try {
            const page = await this.agent.get(constant.MEMRISE_BASE_URL + course)

            console.log("Beginning Scraping: " + constant.MEMRISE_BASE_URL + course)
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

            let words = []
            kr_words.forEach((element, i) => {
                words.push({ kr: kr_words[i], en: en_words[i] })

            });

            return words

        }
        catch (err) {
            console.log(err)
            return err
        }
    }

    // Returns the list of courses for a given user
    async get_course_list(id) {
        await this.get_login_creds(id)
        await this.login()
        return await this.scrapeCourses()
    }

    // Main function for scraping lists from a given course
    async get_word_list(id, url) {
        await this.get_login_creds(id)
        await this.login()
        return await this.scrapeCourseWords(url)
    }

    // Adds a list of words and their translations to a given course
    async bulk_add_words(course, id) {
        await this.get_login_creds(id)
        await this.login()
        try {

            const csv = "Hello,Hello"

            // const data = qs.stringify({
            //     word_delimiter: 'comma',
            //     data: csv,
            //     level_id: '12488818',
            // })

            var data = 'word_delimiter=comma&data=hello%%2Chello%%0Ahelp%%2Cme%%0Aplease%%2C+End+ME&level_id=12488818';

            // const data = {
            //     word_delimiter: 'comma',
            //     data: 'fdsfsd0, sfdfsdfsd',
            //     level_id: '12488818',
            // }

            console.log(data)
            //console.log(course)
            const response = await this.agent
                .post('https://app.memrise.com/ajax/level/add_things_in_bulk/')
                .send(data)
                .withCredentials()
            //console.log(response.request)
            console.log(response.body)
            console.log(`Bulk add status: ${response.status}`)

        }
        catch (error) {
            console.log(error)
        }
    }

    async upload_word_list(wordlist, course_url, voice, speed, id) {
        // Initial worker classes
        const translate = new Papago_Translate()
        const papago_tts = new PapagoTTS()

        console.log(`Beginning adding words to ${course_url}`)
        console.log(wordlist)

        // Main loop for creating wordlist from cache (db) and from papago
        for (let word of wordlist) {
            let exists = await mongodb.get_phrase(word)

            if (exists === null) {
                let translated_word = await translate.get(word)
                let tts = await papago_tts.get_tts(word, speed, voice)
                let result = await mongodb.store_tts(word, translated_word, voice, speed, tts)
                console.log(result)
            }
            else {
                console.log(`Cache hit for: ${word}`)
            }
        }
        //TODO: LOOP TO UPLOAD WORDS and TTS
        // LOOP...

        await this.bulk_add_words(course_url, id)

        ///////////////////////////

        // // Writes audio to db
        // if (this.store_in_db) {
        //     await mongodb.store_tts(this.phrase, this.speaker, this.speed, audio.body)
        //     console.log(`Writing ${this.phrase} to db`)
        // }

        // // Writes audio to disk || FOR TESTING
        // if (!this.store_in_db) {
        //     fs.writeFile(this.phrase + '.wav', audio.body, () => {
        //         console.log(`Writing ${this.phrase} to disk`)
        //     })
        // }

        // For testing the database audio is good
        // for (let word of wordlist) {
        //     try {
        //         let audio = await mongodb.read_tts(word)
        //         await fs.writeFile(word + '.wav', audio)
        //         console.log(`Reading ${word} from dababase`)
        //     }
        //     catch (error) {
        //         console.log(error)
        //     }
        // }
    }

}


//api = new MemriseAPI()

//api.wrapper()

module.exports = {
    MemriseAPI
}