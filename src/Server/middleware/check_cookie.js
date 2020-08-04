const mongodb = require('../js/mongodb')



// MIDDLEWARE Authenticates user and passed profile onto routes
module.exports = function check_cookie(url_exceptions) {
    return async (req, res, next) => {
        // Check if path requires Auth
        if (url_exceptions.includes(req.path.slice(0, -1)) || url_exceptions.includes(req.path) || url_exceptions.includes(`${req.path}/`)) {
            next();
            return
        }
        const id = req.signedCookies['id']
        if (!id) {
            res.status(403)
            res.json({
                message: "Access denied"
            })
            return
        }
        try {
            req.profile = await mongodb.getProfile(id)
            next()
        }
        catch (error) {
            res.status(403)
            res.json({
                message: "Access denied"
            })
        }
    }

}