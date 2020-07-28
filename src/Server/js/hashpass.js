const crypto = require('crypto')
const constant = require('constants')


const genRandomString = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);   /** return required number of characters */
};


function sha512 (password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return value
};

function saltHashPassword (userpassword) {
    var salt = genRandomString(constant.SALT_LEN); /** Gives us salt of length 16 */
    var hash = sha512(userpassword, salt);
    return {
        salt: salt,
        password: hash
    }
}


module.exports = {
    saltHashPassword,
    sha512,
}