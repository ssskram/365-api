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
                    method: 'get',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
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
            fetch("https://cityofpittsburgh.sharepoint.com/sites/Law/EthicsTrainingAdmin/_api/web/lists/GetByTitle('Course progress')/items", {
                    method: 'POST',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    }),
                    body: "{'__metadata': { 'type': 'SP.Data.Course_x0020_progressListItem' }}, " + req.body
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
                    method: 'PUT',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    }),
                    body: "{'__metadata': { 'type': 'SP.Data.Course_x0020_progressListItem' }}, " + req.body
                })
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
                    body: "{'__metadata': { 'type': 'SP.Data.Gift_x0020_disclosuresListItem' }}, " + req.body
                })
                .catch(error => res.status(500).send(error))
        } else res.status(403).end()
    }
)

module.exports = router