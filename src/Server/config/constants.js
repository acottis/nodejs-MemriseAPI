const SALT_LEN = 16
const ALLOW_USER_CREATION = true

const COOKIE_URL_EXCEPTIONS = [`/api`, `/api/logout`, `/api/login`]

// For memrise
const MEMRISE_BASE_URL = 'https://app.memrise.com'
const MEMRISE_LOGIN_PATH = '/login/'
const MEMRISE_GET_COURSES = '/ajax/courses/dashboard/'

// For Papago
const PAPAGO_MAKEID_URL = 'https://papago.naver.com/apis/tts/makeID'
const PAPAGO_TTS_URL = 'https://papago.naver.com/apis/tts/'

module.exports ={
    ALLOW_USER_CREATION,
    SALT_LEN,
    MEMRISE_BASE_URL,
    MEMRISE_LOGIN_PATH,
    MEMRISE_GET_COURSES,
    PAPAGO_MAKEID_URL,
    PAPAGO_TTS_URL,
    COOKIE_URL_EXCEPTIONS,
}