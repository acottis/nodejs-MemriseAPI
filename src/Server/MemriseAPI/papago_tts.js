const superagent = require('superagent')
const constant = require('../config/constants')
const qs = require('qs');

class PapagoTTS {
    constructor() {
        this.agent = superagent.agent()
            .set('Referer', 'https://papago.naver.com/')
            .set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36')
    }

    // Main function that does the work
    async get_tts(phrase, speed, speaker) {
        this.phrase = phrase
        this.speed = speed
        this.speaker = speaker

        const id = await this.request_tts()
        return this.download_tts(id)

    }

    // requests the TTS makeid which creates the audio file
    async request_tts() {

        const data = qs.stringify({
            alpha: 0,
            pitch: 0,
            speaker: this.speaker,
            speed: this.speed,
            text: this.phrase
        })

        // Data that is sent to server
        //console.log(data)
        try {
            const makeid = await this.agent
                .post(constant.PAPAGO_BASE_URL + constant.PAPAGO_MAKEID_URL)
                .type('form')
                .send(data)
            // .buffer(true)
            console.log(makeid.body.id)
            // No longer needed as papago fixed their site
            // const id = Buffer.from(makeid.body).toString('utf-8')
            // return JSON.parse(id)['id']
            return makeid.body.id
        }
        catch (error) {
            //console.log(error)
            return (new Error(`Error while obtaining tts MAKEID`))
        }
    }


    // Uses the makeID id and downloads the audio file
    async download_tts(id) {
        try {
            const audio = await this.agent
                .get(constant.PAPAGO_BASE_URL + constant.PAPAGO_TTS_URL + id)

            return audio.body
        }
        catch (error) {
            return (new Error(`Error while obtaining tts`))
        }
    }
}

module.exports = {
    PapagoTTS,
}