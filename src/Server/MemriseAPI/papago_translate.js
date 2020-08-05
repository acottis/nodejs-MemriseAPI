const superagent = require('superagent')
const constants = require('../config/constants')
const qs = require('qs');
const mongodb = require('../js/mongodb');

class Papago_Translate {

    constructor(){
        this.agent = superagent.agent()
            .set('Referer', 'https://papago.naver.com/')
            .set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36')

    }

    async test(){

    }

}

pap_trans = new Papago_Translate()

pap_trans.test()