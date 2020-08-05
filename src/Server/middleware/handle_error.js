// Returns error message
module.exports = (error, req, res, next) => {
    res.json({message: error.message})
}