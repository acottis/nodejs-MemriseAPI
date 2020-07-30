
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
        this.data = ''
        this.agent = superagent.agent().set('Referer', this.login_url)

    }

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
            console.log(logged_in_page)
        }
        catch (err) {
            console.log(err)
        }
    }
}


api = new MemriseAPI()

api.login()
