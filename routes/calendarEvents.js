const express = require('express')
const router = express.Router()
const checkToken = require('../token')
const fetch = require('node-fetch')
const toBody = require('../util/objectToParams')

global.Headers = fetch.Headers

// new calendar event
router.post('/newEvent',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://graph.microsoft.com/v1.0/users/" + req.query.user + "/calendar/events", {
                    method: 'POST',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await calendarToken(),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }),
                    body: JSON.stringify(req.body)
                })
                .then(response => response.json())
                .then(data => res.status(200).send(data.id))
        } else res.status(403).end()
    }
)

// delete calendar event
router.post('/deleteEvent',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://graph.microsoft.com/v1.0/users/" + req.query.user + "/calendar/events/" + req.query.eventId, {
                method: 'DELETE',
                headers: new Headers({
                    'Authorization': 'Bearer ' + await calendarToken()
                })
            })
            res.status(200).end()
        } else res.status(403).end()
    }
)

const calendarToken = async () => {
    const params = {
        grant_type: process.env.OUTLOOK_TYPE,
        client_id: process.env.OUTLOOK_ID,
        client_secret: process.env.OUTLOOK_SECRET,
        scope: process.env.OUTLOOK_SCOPE,
    }
    const token = await fetch('https://login.microsoftonline.us/f5f47917-c904-4368-9120-d327cf175591/oauth2/v2.0/token', {
        method: 'post',
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: toBody(params)
    })
    const response = await token.json()
    return response.access_token
}

module.exports = router