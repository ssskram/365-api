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

// return incident per advisory ID
router.get('/selectIncident',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items?$filter=AdvisoryID eq '" + req.query.AdvisoryID + "'", {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send(dt(data, models.electronicIncidents).transform())
                })
                .catch(err => res.status(500).send(err))
        } else res.status(403).end()
    }
)

// images per incident
router.get('/attachments',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items(" + req.query.itemId + ")/AttachmentFiles/", {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send(dt(data, models.attachments).transform())
                })
                .catch(err => res.status(500).send(err))
        } else res.status(403).end()
    }
)

// create a new incident record
router.post('/addIncident',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            await fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items", {
                    method: 'POST',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }),
                    body: JSON.stringify(req.body)
                })
                .then(res => res.json())
                .then(data =>  res.status(200).send())
                .catch(error => res.status(500).send(error))
        } else res.status(403).end()
    }
)

// updates an existing incident
router.post('/updateIncident',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            await fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items("+ req.body.itemId +")", {
                    method: 'POST',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-RequestDigest': 'form digest value',
                        'X-HTTP-Method': 'MERGE',
                        'IF-MATCH': '*'
                    }),
                    body: JSON.stringify(req.body)
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send()
                })
                .catch(error => res.status(500).send(error))
        } else res.status(403).end()
    }
)

// return animals per advisory ID
router.get('/selectAnimals',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Animals')/items?$filter=AdvisoryID eq '" + req.query.AdvisoryID + "'", {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send(dt(data, models.animals).transform())
                })
                .catch(err => res.status(500).send(err))
        } else res.status(403).end()
    }
)

// create a new animal record
router.post('/addAnimal',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            await fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Animals')/items", {
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
                    res.status(200).send()
                })
                .catch(error => res.status(500).send(error))
        } else res.status(403).end()
    }
)

// update an existing animal record
router.post('/updateAnimal',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            await fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Animals')/items("+ req.body.itemId +")", {
                    method: 'POST',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-RequestDigest': 'form digest value',
                        'X-HTTP-Method': 'MERGE',
                        'IF-MATCH': '*'
                    }),
                    body: JSON.stringify(req.body)
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send()
                })
                .catch(error => res.status(500).send(error))
        } else res.status(403).end()
    }
)

// delete an existing animal record
router.post('/deleteAnimal',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            await fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Animals')/items("+ req.query.itemId +")", {
                    method: 'POST',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-RequestDigest': 'form digest value',
                        'X-HTTP-Method': 'DELETE',
                        'IF-MATCH': '*'
                    }),
                    body: JSON.stringify(req.body)
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send()
                })
                .catch(error => res.status(500).send(error))
        } else res.status(403).end()
    }
)

// return all animal breeds
router.get('/animalBreeds',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('animalBreeds')/items", {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send(dt(data, models.animalBreeds).transform())
                })
                .catch(err => res.status(500).send(err))
        } else res.status(403).end()
    }
)

// return all animal coats
router.get('/animalCoats',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('animalCoats')/items", {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send(dt(data, models.animalCoats).transform())
                })
                .catch(err => res.status(500).send(err))
        } else res.status(403).end()
    }
)

// return all veterinarians
router.get('/vets',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Veterinarians')/items", {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send(dt(data, models.vets).transform())
                })
                .catch(err => res.status(500).send(err))
        } else res.status(403).end()
    }
)

// return all reasons for visit
router.get('/reasonsForVisit',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('reasonsForVisit')/items", {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send(dt(data, models.reasonsForVisit).transform())
                })
                .catch(err => res.status(500).send(err))
        } else res.status(403).end()
    }
)

// return all call origins
router.get('/callOrigins',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('callOrigins')/items", {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send(dt(data, models.callOrigins).transform())
                })
                .catch(err => res.status(500).send(err))
        } else res.status(403).end()
    }
)

// return citation numbers
router.get('/citationNumbers',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('citationNumbers')/items", {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send(dt(data, models.citationNumbers).transform())
                })
                .catch(err => res.status(500).send(err))
        } else res.status(403).end()
    }
)

// return officer's initials
router.get('/officerInitials',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('officerInitials')/items", {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send(dt(data, models.officerInitials).transform())
                })
                .catch(err => res.status(500).send(err))
        } else res.status(403).end()
    }
)


module.exports = router