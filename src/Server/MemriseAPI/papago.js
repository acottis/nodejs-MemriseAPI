const superagent = require('superagent')
const constants = require('../config/constants')
const qs = require('qs');
const fs = require('fs');
const mongodb = require('../js/mongodb');

class PapagoAPI {
    constructor(speed = 0, speaker = 'kyuri') {
        this.agent = superagent.agent()
            .set('Referer', 'https://papago.naver.com/')
            .set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36')

        this.speaker = speaker
        this.speed = speed

        this.store = 'db' // set to 'disk' for other behavior
    }

    // Main function that does the work
    async get_tts(phrase) {
        const id = await this.request_tts(phrase)
        this.download_tts(id, phrase)
    }

    // requests the TTS makeid which creates the audio file
    async request_tts(phrase) {

        const data = qs.stringify({ data: `{"alpha":0,"pitch":0,"speaker":"${this.speaker}","speed":${this.speed},"text":"${phrase}"}` })
        //console.log(data)
        try {
            const makeid = await this.agent
                .post(constants.PAPAGO_MAKEID_URL)
                .send(data)
                .buffer(true)
            const id = Buffer.from(makeid.body).toString('utf-8')
            return JSON.parse(id)['id']
        }
        catch (error) {
            console.log(error)
        }
    }

    // Downloads TTS files and stores
    async download_tts_to_db(id, phrase) {
        console.log(id)
        try {
            const audio = await this.agent
                .get(constants.PAPAGO_TTS_URL + id)

            // Writes audio to db
            if (this.store === 'db'){
                mongodb.store_tts(audio)
            }

            // Writes audio to disk
            if (this.store === 'disk') {
                fs.writeFile(phrase + '.wav', audio.body, () => {
                    console.log("Writing " + phrase + " to file")
                })
            }
        }
        catch (error) {
            console.log(error)
        }

    }

    // Uses the makeID id and downloads the audio file
    async download_tts(id, phrase) {

        console.log(id)

        try {
            const audio = await this.agent
                .get(constants.PAPAGO_TTS_URL + id)

            fs.writeFile(phrase + '.wav', audio.body, () => {
                console.log("Writing " + phrase + " to file")
            })
        }
        catch (error) {
            console.log(error)
        }

    }
}

api = new PapagoAPI(speed = 0, speaker = 'kyuri')

api.get_tts('안녕하세요')