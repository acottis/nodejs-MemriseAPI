const monk = require('monk')
const hash = require('./hashpass')
const constant = require('./constants')


const db = monk(constant.DB)

db.then(() => {
    console.log('Connected correctly to MongoDB')
})

const users = db.get('users')


exports.getProfile = function (name) {
    return users.findOne({ "name": name })
}


exports.loginUserPromise = function (creds) {

    return new Promise(function (resolve, reject) {
        //  exists = users.count({ "name": req.name }).then(exists => {
        user = users.findOne({ "name": creds.name }).then(user => {
            console.log(user)

            // If user does not exist register them
            if (!user) {

                console.log("User does not exist")

                const pwhash = hash.saltHashPassword(creds.password)
                const user = {
                    "name": creds.name,
                    "password": pwhash.password,
                    "salt": pwhash.salt,
                    "created": creds.created
                }
                users.insert(user).then(() => {
                    console.log("User creation finished")
                    resolve(true)
                })
            }
            else {
                // Check user password with database and try log them in
                new_hash = hash.sh512(creds.password, user.salt)
                stored_hash = user.password
                if (new_hash == stored_hash) {
                    console.log("Success login finished")
                    resolve(true)
                }
                else {
                    console.log("Wrong pass finished")
                    resolve(false)

                }
            }
        })
    })
}
