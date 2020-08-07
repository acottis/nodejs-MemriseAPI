const SALT_LEN = 16
const ALLOW_USER_CREATION = true

const COOKIE_URL_EXCEPTIONS = [`/api`, `/api/logout`, `/api/login`]

// For memrise
const MEMRISE_BASE_URL = 'https://app.memrise.com'
const MEMRISE_LOGIN_PATH = '/login/'
const MEMRISE_GET_COURSES = '/ajax/courses/dashboard/'
const MEMRISE_BULK_UPLOAD = '/ajax/level/add_things_in_bulk/'

// For Papago
const PAPAGO_BASE_URL = 'https://papago.naver.com/apis'
const PAPAGO_MAKEID_URL = '/tts/makeID'
const PAPAGO_TTS_URL = '/tts/'
const PAPAGO_TRANSLATE_URL = '/n2mt/translate'
const PAPAGO_TRANSLATE_API = 'https://openapi.naver.com/v1/papago/n2mt'

const TTS_SPEED = 0
const TTS_VOICE = 'kyuri'

module.exports ={
    PAPAGO_BASE_URL,
    PAPAGO_TRANSLATE_URL,
    ALLOW_USER_CREATION,
    SALT_LEN,
    MEMRISE_BASE_URL,
    MEMRISE_LOGIN_PATH,
    MEMRISE_GET_COURSES,
    PAPAGO_MAKEID_URL,
    PAPAGO_TTS_URL,
    COOKIE_URL_EXCEPTIONS,
    TTS_SPEED,
    TTS_VOICE,
    MEMRISE_BULK_UPLOAD,
    PAPAGO_TRANSLATE_API,
}