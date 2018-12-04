
// got a valid bearer token?

const checkToken = (token) => {
    if (token == process.env.BEARER) return true
    else return false
}

module.exports = checkToken