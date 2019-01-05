const express = require('express')
const router = express.Router()
const checkToken = require('../token')
const refreshToken = require('../refresh')
const fetch = require('node-fetch')

global.Headers = fetch.Headers

// new gift disclosure
router.post('/sms',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/InnovationandPerformance/Analytics/gbgb/_api/web/lists/GetByTitle('musings')/items", {
                    method: 'POST',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    }),
                    body: JSON.stringify(req.body)
                })
                .then(res.status(200).send())
                .catch(error => res.status(500).send(error))
        } else res.status(403).end()
    }
)

module.exports = router