const SALT_LEN = 16;
const ALLOW_USER_CREATION = true;

const COOKIE_URL_EXCEPTIONS = [`/`,`/favicon.ico`,`/index.html`,`/js/index.js`,`/css/custom.css`,`/css/skeleton.css`,`/css/darkmode.css`,`/css/normalize.css`,`/api`, `/api/logout`, `/api/login`];

// For memrise
const MEMRISE_BASE_URL = 'https://app.memrise.com';
const MEMRISE_LOGIN_PATH = '/login/';
const MEMRISE_GET_COURSES = '/ajax/courses/dashboard/';
const MEMRISE_BULK_UPLOAD = '/ajax/level/add_things_in_bulk/';

// For Papago
const PAPAGO_BASE_URL = 'https://papago.naver.com/apis';
const PAPAGO_MAKEID_URL = '/tts/makeID';
const PAPAGO_TTS_URL = '/tts/';
const PAPAGO_TRANSLATE_URL = '/n2mt/translate';
const PAPAGO_TRANSLATE_API = 'https://openapi.naver.com/v1/papago/n2mt';

const TTS_PITCH = 0;
const TTS_SPEED = 1;
const TTS_VOICE = 'ko-KR-Wavenet-A';
const TTS_LOCALE = 'ko-KR';
const TTS_ENCODING = 'LINEAR16';

// For google
const GC_TTS_URL = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${process.env.GC_TTS_API_KEY}`;

module.exports = {
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
	GC_TTS_URL,
	TTS_LOCALE,
	TTS_PITCH,
	TTS_ENCODING,
};
