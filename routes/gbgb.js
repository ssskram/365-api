const express = require('express')
const router = express.Router()
const checkToken = require('../token')
const refreshToken = require('../refresh')
const fetch = require('node-fetch')
const dt = require('node-json-transform').DataTransform
const models = require('../models/gbgb')

global.Headers = fetch.Headers

// get musings
router.get('/musings',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/InnovationandPerformance/Analytics/gbgb/_api/web/lists/GetByTitle('musings')/items?$top=5000", {
                    method: 'GET',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send(dt(data, models.musing).transform())
                })
                .catch(err => console.log(err))
        } else res.status(403).end()
    }
)

// new musing
router.post('/musing',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/InnovationandPerformance/Analytics/gbgb/_api/web/lists/GetByTitle('musings')/items", {
                method: 'POST',
                headers: new Headers({
                    'Authorization': 'Bearer ' + await refreshToken(),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }),
                body: JSON.stringify(req.body)
            })
            res.status(200)
        } else res.status(403).end()
    }
)

module.exports = router