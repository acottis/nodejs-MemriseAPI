const monk = require('monk')
const { v4: uuidv4 } = require('uuid');

const hash = require('./hashpass')
const constant = require('../config/constants')


// Init mongodb
const db = monk(constant.DB)
db.then(() => {
    console.log('Connected correctly to MongoDB')
})
const users = db.get('users')
const words = db.get('words')

//Adds Courses to database
function addCourses(id, courses) {
    users.findOneAndUpdate({ cookie_uuid: id }, {
        $set: {
            memrise_courses: courses,
        }
    })
}

// Returns the profile associated with a cookie
function getProfile(id) {
    return users.findOne({ "cookie_uuid": id })
}

// Logs in users and sets cookies in DB
function loginUserPromise(creds) {

    return new Promise(async (resolve, reject) => {

        // Gets the user profile from database
        user = await users.findOne({ "name": creds.name })

        // Generate cookie seed as uuidv4
        uuid = uuidv4()

        // If user does not exist register them
        if (!user && constant.ALLOW_USER_CREATION == true) {

            console.log("User does not exist")

            const pwhash = hash.saltHashPassword(creds.password)
            const user = {
                "name": creds.name,
                "password": pwhash.password,
                "salt": pwhash.salt,
                "created": creds.created,
                "cookie_uuid": uuid
            }
            try {
                // Inserts user into database as new account
                await users.insert(user)
                resolve({
                    message: "User creation finished",
                    id: uuid
                })
            }
            catch (error) {
                reject({
                    message: "Failed to add user to database",
                })
            }

        }
        else if (!user && ALLOW_USER_CREATION == false) {
            reject({
                message: "User Creation is Disabled",
            })
        }
        else {
            // Check user password with database and try log them in
            new_hash = hash.sha512(creds.password, user.salt)
            stored_hash = user.password
            if (new_hash == stored_hash) {
                users.findOneAndUpdate({ name: creds.name }, { $set: { cookie_uuid: uuid } })
                resolve({
                    message: "Success login finished",
                    id: uuid
                })
            }
            else {
                reject({
                    message: "Login Failed",
                })
            }
        }
    })
}

function addMemriseCreds(id, creds) {
    console.log(id, creds)
    return new Promise(async (resolve, reject) => {
        try {
            const doc = await users.findOneAndUpdate({ cookie_uuid: id }, {
                $set: {
                    memrise: {
                        username: creds['name'],
                        password: creds['password']
                    }
                }
            })
            resolve({
                message: `Memrise credentials successfully added for ${doc.memrise.username}`,
            })
        }
        catch (error) {
            // console.log(error)
            reject({
                message: "Something went wrong while adding memrise credentials"
            })
        }
    })
}

const store_tts = async (kr_phrase, audio) => {
    //await words.insert({ kr: kr_phrase, tts: audio })
    return words.insert({ kr: kr_phrase, tts: audio })
}

// Returns the binary audio from the database for a given word
const read_tts = (word = '안녕하세요') => {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = await words.findOne(users.findOne({ "kr": word }))
            resolve(doc.tts.buffer)
        }
        catch (error) {
            reject(`Phrase: ${word} could not be read from database`)
        }
    })
}

module.exports = {
    loginUserPromise,
    getProfile,
    addMemriseCreds,
    addCourses,
    store_tts,
    read_tts,
}

