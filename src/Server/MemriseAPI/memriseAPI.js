
const constant = require('../config/constants')
const secret = require('../config/secrets')

const qs = require('qs');
const superagent = require('superagent');








//LOGIN TO MEMRISE

class MemriseAPI {
    constructor(course) {
        this.course_url = course
        this.login_url = constant.MEMRISE_BASE_URL + constant.MEMRISE_LOGIN_PATH
        this.middlwaretoken = ''
        this.token = ''
        this.data = ''
    }

    test() {
        const agent = superagent.agent().set('Referer', 'https://www.memrise.com/login/')
        agent.get('https://www.memrise.com/login/')
            .then(res => {
                let raw_csrf = res.text.match(/value="\S{10,}/gi) + ""
                this.middlwaretoken = raw_csrf.split(/"/)[1]

                this.data = qs.stringify({
                    'username': secret.MEMRISE_USERNAME,
                    'password': secret.MEMORISE_PASSWORD,
                    'csrfmiddlewaretoken': this.middlwaretoken,
                    'next': ''
                })
                agent.post('https://www.memrise.com/login/')
                    .send(this.data)
                    .then(res => {
                        console.log(res)
                    })
                // return agent.get('https://www.memrise.com/login/');
            })

        //console.log(agent)

        // (async () => {
        //     try {
        //         const res = await superagent.post('https://www.memrise.com/login/');
        //         console.log(res);
        //     } catch (err) {
        //         console.error(err);
        //     }
        // })();
    }
}


api = new MemriseAPI()

api.test()