const superagent = require('superagent')
const constant = require('../config/constants')
const qs = require('qs');

class Papago_Translate {

    constructor() {
        this.agent = superagent.agent()
            .set('Referer', 'https://papago.naver.com/')
            .set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36')
    }

    // Get translation
    async get(phrase) {
        return new Promise(async (resolve, reject) => {
            // Possible for language expansion here
            const data = qs.stringify({
                locale: 'kr',
                dict: 'false',
                honorific: false,
                instant: true, // Seems okay but be SUSPICIOUS , reduces size of reponse but I think might be worse translation
                source: 'ko',
                target: 'en',
                text: phrase
            })

            //console.log(data)
            try {
                const trans = await this.agent
                    .post(constant.PAPAGO_BASE_URL + constant.PAPAGO_TRANSLATE_URL)
                    .type('form')
                    .send(data)
                console.log(trans.body.translatedText)
                resolve(trans.body.translatedText)

            }
            catch (error) {
                reject(new Error(`Problem with translation of ${phrase}`))
            }
        })
    }
}

module.exports = {
    Papago_Translate,
}

