const monk = require('monk')
const hash = require('./hashpass')
const constant = require('./constants')


const db = monk(constant.DB)

db.then(() => {
    console.log('Connected correctly to MongoDB')
})

const users = db.get('users')


exports.getProfile = function (name){

    return users.findOne({ "name": name })

}


exports.loginUser = function (creds, req, res) {

  //  exists = users.count({ "name": req.name }).then(exists => {
    user = users.findOne({ "name": creds.name }).then(user => {
       // console.log(user)

        // If user does not exist regiter them
        if (!user) {

            console.log("User does not exist")

            const pwhash = hash.saltHashPassword(creds.password)
            const user = {
                "name": creds.name,
                "password": pwhash.password,
                "salt": pwhash.salt,
                "created": creds.created
            }
            users.insert(user).then(createdUser => {
                res.cookie(name="id",val=user.name, {signed: true}) 
                res.status(200)
                res.json({
                    registered : createdUser,
                    message: "User Created"
                })

            })
        }
        else {

            // Check user password with database
            console.log("User exists")
            new_hash = hash.sh512(creds.password, user.salt)
            stored_hash = user.password
            if (new_hash == stored_hash){
                res.status(200)
                res.cookie(name="id",val=user.name, {signed: true})   
                res.json({
                    message: "Sucessful Login",
                })      
                
            }
            else{
                res.status(422)
                res.json({
                    message: "Wrong password"
                })
            }

            // console.log("No user " + creds.name + " created")

        }

    })
}
