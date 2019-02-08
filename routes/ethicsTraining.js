const express = require('express')
const router = express.Router()
const checkToken = require('../token')
const refreshToken = require('../refresh')
const fetch = require('node-fetch')
const dt = require('node-json-transform').DataTransform
const models = require('../models/ethicsTraining')

global.Headers = fetch.Headers

// return user's course history
router.get('/courseHistory',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/Law/EthicsTrainingAdmin/_api/web/lists/GetByTitle('Course progress')/items?$filter=Email eq '" + req.query.user + "'", {
                    method: 'GET',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json;odata=verbose',
                        'Content-Type': 'application/json;odata=verbose',
                        "X-RequestDigest": "form digest value"
                    })
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send(dt(data, models.course).transform())
                })
                .catch(err => console.log(err))
        } else res.status(403).end()
    }
)

// create a course record
router.post('/newCourse',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            await fetch("https://cityofpittsburgh.sharepoint.com/sites/Law/EthicsTrainingAdmin/_api/web/lists/GetByTitle('Course progress')/items", {
                    method: 'POST',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }),
                    body: JSON.stringify(req.body)
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send({
                        id: data.Id
                    })
                })
                .catch(error => res.status(500).send(error))
        } else res.status(403).end()
    }
)

// update a course record
router.post('/updateCourse',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/Law/EthicsTrainingAdmin/_api/web/lists/GetByTitle('Course progress')/items(" + req.query.id + ")", {
                    method: 'MERGE',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        "IF-MATCH": "*"
                    }),
                    body: JSON.stringify(req.body)
                })
                .then(res.status(200).send())
                .catch(error => res.status(500).send(error))
        } else res.status(403).end()
    }
)

// new gift disclosure
router.post('/giftDisclosure',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/Law/EthicsTrainingAdmin/_api/web/lists/GetByTitle('Gift disclosures')/items", {
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