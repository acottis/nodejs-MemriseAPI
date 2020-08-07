const superagent = require('superagent');
const constant = require('../config/constants');

class GoogleTTS {
  constructor() {
    this.agent = superagent.agent();
  }

  // Grabs TTS from Google
  async get(phrase, speed, voice) {
    const data = {
      audioConfig: {
        audioEncoding: `${constant.TTS_ENCODING}`,
        effectsProfileId: ['handset-class-device'],
        pitch: 0,
        speakingRate: `${speed}`,
      },
      input: {
        text: `${phrase}`,
      },
      voice: {
        languageCode: `${constant.TTS_LOCALE}`,
        name: `${voice}`,
      },
    };
    // Data that is sent to server
    // console.log(data)
    try {
      const res = await this.agent.post(constant.GC_TTS_URL).send(data);
      // console.log(res.body)
      const binary_audio = new Buffer.from(res.body['audioContent'], 'base64');
      return binary_audio;
    } catch (error) {
      //console.log(error)
      return new Error(`Error while obtaining TTS from google`);
    }
  }
}

module.exports = {
  GoogleTTS,
};
