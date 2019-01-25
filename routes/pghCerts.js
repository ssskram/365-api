const express = require('express')
const router = express.Router()
const checkToken = require('../token')
const refreshToken = require('../refresh')
const fetch = require('node-fetch')
const dt = require('node-json-transform').DataTransform
const models = require('../models/pghCerts')

global.Headers = fetch.Headers

// get list of certifications
router.get('/certTypes',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/certs/_api/web/lists/GetByTitle('Certifications')/items?$top=5000", {
                    method: 'GET',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send(dt(data, models.certs).transform())
                })
                .catch(err => console.log(err))
        } else res.status(403).end()
    }
)

// get all certification history
router.get('/certHistory',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/certs/_api/web/lists/GetByTitle('Cert History')/items?$top=5000", {
                    method: 'GET',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send(dt(data, models.certHistory).transform())
                })
                .catch(err => console.log(err))
        } else res.status(403).end()
    }
)

// get all course history
router.get('/courseHistory',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/certs/_api/web/lists/GetByTitle('Course History')/items?$top=5000", {
                    method: 'GET',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send(dt(data, models.courseHistory).transform())
                })
                .catch(err => console.log(err))
        } else res.status(403).end()
    }
)

module.exports = router