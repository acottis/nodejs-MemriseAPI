process.title = "memriseAPI"
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const check_cookie = require('./middleware/check_cookie');
const handle_error = require('./middleware/handle_error');
const valid = require('./js/isValid');
const mongodb = require('./js/mongodb');
const constant = require('./config/constants');

// Routes relating to MemriseAPI
const { router } = require('./MemriseAPI/memrise');

// Initialise Express
const app = express();

let cookieSettings = {}
if (process.env.NODE_ENV == "production") {
	cookieSettings = {
		expires: new Date(Date.now() + 8 * 3600000),
		signed: true,
		httpOnly: true,
		sameSite: 'None',
		secure: true,
	}
	// app.set('trust proxy', 1);
} else {
    cookieSettings = {
		expires: new Date(Date.now() + 8 * 3600000),
		signed: true,
		httpOnly: true,
	}
}

console.log(cookieSettings)


// HTTP hardening with headers
app.use(helmet());
// Security hardening //TODO MAKE THIS GOOD
app.use(
	cors({
		origin: true,
		credentials: true,
	})
);
// Middlewhere for handling signed cookies
app.use(cookieParser(process.env.COOKIE_SECRET));
// My middlewhere that ensures requests are authenticated
app.use(check_cookie(constant.COOKIE_URL_EXCEPTIONS));
// Middleware for handling json requests
app.use(express.json());

// Add routes for the memrise API
app.use('/api/memrise', router);

// Delcare port
const port = process.env.PORT || 8080

// Listen for static files
app.use(express.static('public'));

// listen for new requests
app.listen(port, () => {
	console.log(`Listening on: ${process.env.API_URL}:${port}/api`);
});

// Test URL
app.get('/api', (req, res) => {
	console.log('안녕하세요!');
	res.cookie('Test', 'test');
	res.json({
		message: '안녕!',
	});
});

// Returns profile information on landing page
app.get('/api/profile', async (req, res) => {
	res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
	res.setHeader('Expires', '0');
	res.json(req.profile['name']);
});

// Handles Login and cookie assignment
app.post('/api/login', async (req, res) => {
	//console.log(req.headers.cookie)
	if (valid.login(req.body)) {
		const creds = {
			name: req.body.name.toString().toLowerCase().trim(),
			password: req.body.password.toString().trim(),
			created: new Date(),
		};
		// Attempts to log in and and handles failures
		try {
			const result = await mongodb.loginUserPromise(creds);
			res.status(200);
			res.cookie(name = 'id', val = result['id'], cookieSettings);
			res.json({
				message: result['message'],
			});
			console.log(`${creds.name} has logged in`)
		} catch (error) {
			res.status(403);
			res.json(error);
		}
	} else {
		res.status(422);
		res.json({
			message: 'Invalid Data Recieved',
		});
	}
});

// Logs out by deleting cookie
app.post('/api/logout', (req, res) => {
	res.status(200);
	res.clearCookie('id', { signed: true });
	res.json({
		message: 'Logged out successful',
	});
});

// Error handling middleware
app.use(handle_error);
