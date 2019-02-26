const express = require('express')
const router = express.Router()
const checkToken = require('../token')
const refreshToken = require('../refresh')
const fetch = require('node-fetch')
const dt = require('node-json-transform').DataTransform
const models = require('../models/pghCerts')

global.Headers = fetch.Headers

// returns user profile, if existent
router.get('/userProfile',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/certs/_api/web/lists/GetByTitle('User Profiles')/items?$filter=Email eq '" + req.query.user + "'", {
                    method: 'GET',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send(dt(data, models.userProfiles).transform())
                })
                .catch(err => console.log(err))
        } else res.status(403).end()
    }
)

// creates new user profile, returns the id
router.post('/userProfile',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            await fetch("https://cityofpittsburgh.sharepoint.com/sites/certs/_api/web/lists/GetByTitle('User Profiles')/items", {
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

// returns true if supplied email param is contained in SP group
router.get('/isAdmin',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/certs/_api/web/sitegroups(8)/users?$select=Email", {
                    method: 'GET',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data["value"].find(admin => admin.Email == req.query.user)) {
                        res.status(200).send({
                            isAdmin: true
                        })
                    } else {
                        res.status(200).send({
                            isAdmin: false
                        })
                    }
                })
                .catch(err => res.status(500).send(err))
        } else res.status(403).end()
    }
)

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
                .catch(err => res.status(500).send(err))
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
                .catch(err => res.status(500).send(err))
        } else res.status(403).end()
    }
)

// new cert record
router.post('/certHistory',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/certs/_api/web/lists/GetByTitle('Cert History')/items", {
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

// update cert record
router.post('/updateCourse',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/certs/_api/web/lists/GetByTitle('Cert History')/items(" + req.query.id + ")", {
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

module.exports = router