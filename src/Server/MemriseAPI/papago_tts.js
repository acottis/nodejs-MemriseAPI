const superagent = require('superagent')
const constants = require('../config/constants')
const qs = require('qs');
const fs = require('fs');
const mongodb = require('../js/mongodb');

class PapagoTTS {
    constructor() {
        this.agent = superagent.agent()
            .set('Referer', 'https://papago.naver.com/')
        // .set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36')

        this.store_in_db = true // set to 'disk' for other behavior
    }

    // Main function that does the work
    async get_tts(phrase, speed, speaker) {
        this.phrase = phrase
        this.speed = speed
        this.speaker = speaker

        try {
            const exists = await mongodb.get_phrase()
            if (exists === null) {
                console.log("Phrase doesnt exist")
                const id = await this.request_tts()
                await this.download_tts(id)
            }
        }
        catch (error) {
            console.log("papago_tts.get_tts caught error")
        }
    }

    // requests the TTS makeid which creates the audio file
    async request_tts() {
        //const data = qs.stringify({ data: `{"alpha":0,"pitch":0,"speaker":"${this.speaker}","speed":${this.speed},"text":"${this.phrase}"}` })
        //const data = qs.stringify({`alpha=0&pitch=0&speaker=${this.speaker}&speed=${this.speed}&text=${this.phrase}.`})
        const data = qs.stringify({
            alpha: 0,
            pitch: 0,
            speaker: this.speaker,
            speed: this.speed,
            text: this.phrase
        })

        console.log(data)
        try {
            const makeid = await this.agent
                .post(constants.PAPAGO_MAKEID_URL)
                .type('form')
                .send(data)
                .buffer(true)
            console.log(makeid.body.id)
            // No longer needed as papago fixed their site
           // const id = Buffer.from(makeid.body).toString('utf-8')
           // return JSON.parse(id)['id']
           return makeid.body.id
        }
        catch (error) {
            console.log(error)
            console.log("here it broke")
        }
    }


    // Uses the makeID id and downloads the audio file
    async download_tts(id) {

        try {
            const audio = await this.agent
                .get(constants.PAPAGO_TTS_URL + id)


            // Writes audio to db
            if (this.store_in_db) {
                await mongodb.store_tts(this.phrase, this.speaker, this.speed, audio.body)
                console.log(`Writing ${this.phrase} to db`)
            }

            // Writes audio to disk || FOR TESTING
            if (!this.store_in_db) {
                fs.writeFile(this.phrase + '.wav', audio.body, () => {
                    console.log(`Writing ${this.phrase} to disk`)
                })
            }
        }
        catch (error) {
            //console.log(error)
        }

    }
}

module.exports = {
    PapagoTTS,
}