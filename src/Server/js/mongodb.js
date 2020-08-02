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

// Returns the profile associated with a cookie
function getProfile(id) {
    return users.findOne({ "cookie_uuid": id })
}

// Logs in users and sets cookies in DB
function loginUserPromise(creds) {

    return new Promise((resolve, reject) => {
        //  exists = users.count({ "name": req.name }).then(exists => {
        user = users.findOne({ "name": creds.name }).then(user => {
            console.log(user)

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
                users.insert(user).then(() => {
                    resolve({
                        success: true,
                        message: "User creation finished",
                        id: uuid
                    })
                })
            }
            else if (!user && ALLOW_USER_CREATION == false) {
                resolve({
                    success: false,
                    message: "User Creation is Disabled",
                })
            }
            else {
                // Check user password with database and try log them in
                new_hash = hash.sha512(creds.password, user.salt)
                stored_hash = user.password
                if (new_hash == stored_hash) {
                    users.findOneAndUpdate({ name: creds.name }, { $set: { cookie_uuid: uuid } }).then(result => {
                        console.log(result)
                        resolve({
                            success: true,
                            message: "Success login finished",
                            id: uuid
                        })
                    })
                }
                else {
                    resolve({
                        success: false,
                        message: "Login Failed",
                    })
                }
            }
        })
    })
}

function addMemriseCreds(id, creds) {
    console.log(id, creds)
    return new Promise((resolve, reject) => {
        try {
            users.findOneAndUpdate({ cookie_uuid: id }, {
                $set: {
                    memrise: {
                        username: creds['name'],
                        password: creds['password']
                    }
                }
            }).then(result => {
                resolve({
                    message: "Memrise credentials successfully added",
                })
            })
        }
        catch(error){
            console.log(error)
            reject({
                message: "Something went wrong while adding memrise credentials"
            })
        }
    })
}

// When a request for autherised reouse happens checks if cooke is valid and who it is
function checkCookie(id) {
    return new Promise((resolve, reject) => {
        if (!id){
            reject({
                message: "Access denied",
            })
        }
        try {
            getProfile(uuid = id).then(profile => {
                // These headers prevent access to cached content with reauth
                resolve({
                    profile: profile,
                    message: "Sucess"
                })
            })
        }
        catch (e) {
            console.log(e)
            reject({
                message: "Access denied",
            })
        }
    })
}


module.exports = {
    loginUserPromise,
    getProfile,
    checkCookie,
    addMemriseCreds,
}