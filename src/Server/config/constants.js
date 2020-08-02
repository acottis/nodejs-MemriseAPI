const COOKIE_SECRET = 'sxN%3P7K@*$CsK@RS$Qb'
const SALT_LEN = 16
const API_URL = 'http://localhost'
const PORT = 8080
const DB = 'localhost/memrise'
const ALLOW_USER_CREATION = true

// For memrise
const MEMRISE_BASE_URL = 'https://www.memrise.com'
const MEMRISE_LOGIN_PATH = '/login/'
const MEMRISE_GET_COURSES = '/ajax/courses/dashboard/'

// For Papago
const PAPAGO_MAKEID_URL = 'https://papago.naver.com/apis/tts/makeID'
const PAPAGO_TTS_URL = 'https://papago.naver.com/apis/tts/'

module.exports ={
    COOKIE_SECRET,
    API_URL,
    PORT,
    DB,
    ALLOW_USER_CREATION,
    SALT_LEN,
    MEMRISE_BASE_URL,
    MEMRISE_LOGIN_PATH,
    MEMRISE_GET_COURSES,
    PAPAGO_MAKEID_URL,
    PAPAGO_TTS_URL,
}