const fetch = require('node-fetch')
const toBody = require('./util/objectToParams')

global.Headers = fetch.Headers

const refreshToken = async () => {
    const params = {
        grant_type: process.env.SP_TYPE,
        client_id: process.env.SP_ID,
        client_secret: process.env.SP_SECRET,
        refresh_token: process.env.SP_TOKEN,
        redirect_uri: process.env.SP_REDIRECT,
        resource: process.env.SP_RESOURCE
    }
    const token = await fetch('https://accounts.accesscontrol.windows.net/f5f47917-c904-4368-9120-d327cf175591/tokens/OAuth/2', {
        method: 'post',
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: toBody(params)
    })
    const response = await token.json()
    return response.access_token
}

module.exports = refreshToken