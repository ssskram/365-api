const express = require('express')
const router = express.Router()
const checkToken = require('../token')
const refreshToken = require('../refresh')
const fetch = require('node-fetch')
const dt = require('node-json-transform').DataTransform
const models = require('../models/accMobile')

global.Headers = fetch.Headers

// return users
router.get('/allUsers',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Accmobileusers')/items", {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send(dt(data, models.allUsers).transform())
                })
                .catch(err => res.status(500).send(err))
        } else res.status(403).end()
    }
)

// return all incidents
let allIncidents = []
router.get('/allIncidents',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            try {
                await electronicIncidents("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items?$top=5000")
                await analogIncidents("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('GeocodedAdvises')/items?$top=5000")
                const merged = allIncidents[0].concat(allIncidents[1])
                res.status(200).send(merged)
            } catch (err) {
                res.status(500).send(err)
            }
        } else res.status(403).end()
    }
)
const electronicIncidents = async (url) => {
    await fetch(url, {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Bearer ' + await refreshToken(),
                'Accept': 'application/json'
            })
        })
        .then(res => res.json())
        .then(data => dt(data, models.electronicIncidents).transform())
        .then(transformed => allIncidents.push(transformed))
        .catch(err => console.log(err))
}
const analogIncidents = async (url) => {
    await fetch(url, {
            method: 'get',
            headers: new Headers({
                'Authorization': 'Bearer ' + await refreshToken(),
                'Accept': 'application/json'
            })
        })
        .then(res => res.json())
        .then(data => dt(data, models.analogIncidents).transform())
        .then(transformed => allIncidents.push(transformed))
        .catch(err => console.log(err))
}


// return all animals
router.get('/allAnimals',
    function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            res.status(200).send('Got it!')
        } else res.status(403).end()
    }
)

// return all animal breeds
router.get('/allBreeds',
    function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            res.status(200).send('Got it!')
        } else res.status(403).end()
    }
)

// return all animal coats
router.get('/allCoats',
    function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            res.status(200).send('Got it!')
        } else res.status(403).end()
    }
)

// return all veterinarians
router.get('/vets',
    function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            res.status(200).send('Got it!')
        } else res.status(403).end()
    }
)

// return all reasons for visit
router.get('/reasonsForVisit',
    function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            res.status(200).send('Got it!')
        } else res.status(403).end()
    }
)

// return all call origins
router.get('/callOrigins',
    function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            res.status(200).send('Call origins!')
        } else res.status(403).end()
    }
)

// return citation numbers
router.get('/citationNumbers',
    function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            res.status(200).send('Got it!')
        } else res.status(403).end()
    }
)

// return officer's initials
router.get('/officerInitials',
    function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            res.status(200).send('Got it!')
        } else res.status(403).end()
    }
)


module.exports = router