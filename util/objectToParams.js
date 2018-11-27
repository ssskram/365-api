// given an object literal, returns a string for post body

const objectToParams = (obj) => {
    const params = Object.entries(obj).map(([key, val]) => `${key}=${val}`).join('&')
    return params
}

module.exports = objectToParams