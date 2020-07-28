const monk = require('monk')
const { v4: uuidv4 } = require('uuid');

const hash = require('./hashpass')
const constant = require('./constants')
const { ALLOW_USER_CREATION } = require('./constants')


// Init mongodb
const db = monk(constant.DB)
db.then(() => {
    console.log('Connected correctly to MongoDB')
})
const users = db.get('users')


function getProfile(id) {
    return users.findOne({ "cookie_uuid": id })
}


function loginUserPromise(creds) {

    return new Promise(function (resolve, reject) {
        //  exists = users.count({ "name": req.name }).then(exists => {
        user = users.findOne({ "name": creds.name }).then(user => {
            console.log(user)

            // Generate cookie seed as uuidv4
            uuid = uuidv4()

            // If user does not exist register them
            if (!user && ALLOW_USER_CREATION == true) {

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
                    users.findOneAndUpdate({ name: creds.name}, {$set : {cookie_uuid: uuid}}).then(result => {
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

module.exports = {
    loginUserPromise,
    getProfile,
}