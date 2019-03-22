const express = require('express')
const router = express.Router()
const refreshToken = require('../refresh')
const dt = require('node-json-transform').DataTransform
const models = require('../models/accMobile')
const fetch = require("node-fetch")

// return users
router.get('/allUsers', async (req, res) => {
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
})

// return all incidents
router.get('/allIncidents', async (req, res) => {
    try {
        const ei = await electronicIncidents("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items?$top=5000")
        const ai = await analogIncidents("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('GeocodedAdvises')/items?$top=5000")
        const merged = ei.concat(ai)
        res.status(200).send(merged)
    } catch (err) {
        res.status(500).send(err)
    }
})
const electronicIncidents = async (url) => {
    const ei = await fetch(url, {
        method: 'get',
        headers: new Headers({
            'Authorization': 'Bearer ' + await refreshToken(),
            'Accept': 'application/json'
        })
    })
        .then(res => res.json())
        .then(data => dt(data, models.electronicIncidents).transform())
    return ei
}
const analogIncidents = async (url) => {
    const ai = await fetch(url, {
        method: 'get',
        headers: new Headers({
            'Authorization': 'Bearer ' + await refreshToken(),
            'Accept': 'application/json'
        })
    })
        .then(res => res.json())
        .then(data => dt(data, models.analogIncidents).transform())
    return ai
}

// return incident per advisory ID
router.get('/selectIncident', async (req, res) => {
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
})

// provided an incident ID as query param, returns all meta so client can grab from blob
router.get('/attachments', async (req, res) => {
    fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Attachments')/items?$filter=incidentID eq '" + req.query.incidentID + "'", {
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
})

// create a new meta record in attachment table
router.post('/attachmentMeta', async (req, res) => {
    await fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Attachments')/items", {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + await refreshToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }),
        body: JSON.stringify(req.body)
    })
        .then(() => res.status(200).send())
        .catch(error => res.status(500).send(error))
})

// delete a record in the attachment table
router.get('/deleteAttachment', async (req, res) => {
    await fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Attachments')/items(" + req.query.itemId + ")", {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + await refreshToken(),
            'Accept': 'application/json',
            'IF-MATCH': "*",
            "X-HTTP-Method": "DELETE"
        }),
        body: JSON.stringify(req.body)
    })
        .then(() => res.status(200).send())
        .catch(error => res.status(500).send(error))
})


// create a new incident record
router.post('/addIncident', async (req, res) => {
    await fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items", {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + await refreshToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }),
        body: JSON.stringify(req.body)
    })
        .then(() => res.status(200).send())
        .catch(error => res.status(500).send(error))
})

// updates an existing incident
router.post('/updateIncident', async (req, res) => {
    await fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Incidents')/items(" + req.body.Id + ")", {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + await refreshToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-HTTP-Method': 'MERGE',
            'IF-MATCH': '*'
        }),
        body: JSON.stringify(req.body)
    })
        .then(() => res.status(200).send())
        .catch(error => res.status(500).send(error))
})

// return animals per advisory ID
router.get('/selectAnimals', async (req, res) => {
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
})

// create a new animal record
router.post('/addAnimal', async (req, res) => {
    await fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Animals')/items", {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + await refreshToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }),
        body: JSON.stringify(req.body)
    })
        .then(() => res.status(200).send())
        .catch(error => res.status(500).send(error))
})

// update an existing animal record
router.post('/updateAnimal', async (req, res) => {
    await fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Animals')/items(" + req.body.Id + ")", {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + await refreshToken(),
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-HTTP-Method': 'MERGE',
            'IF-MATCH': '*'
        }),
        body: JSON.stringify(req.body)
    })
        .then(() => res.status(200).send())
        .catch(error => res.status(500).send(error))
})

// delete an existing animal record
router.post('/deleteAnimal', async (req, res) => {
    await fetch("https://cityofpittsburgh.sharepoint.com/sites/PublicSafety/ACC/_api/web/lists/GetByTitle('Animals')/items(" + req.query.itemId + ")", {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + await refreshToken(),
            'Accept': 'application/json',
            'IF-MATCH': "*",
            "X-HTTP-Method": "DELETE"
        }),
        body: JSON.stringify(req.body)
    })
        .then(() => res.status(200).send())
        .catch(error => res.status(500).send(error))
})

// return all animal breeds
router.get('/animalBreeds', async (req, res) => {
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
})

// return all animal coats
router.get('/animalCoats', async (req, res) => {
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
})

// return all veterinarians
router.get('/vets', async (req, res) => {
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
})

// return all reasons for visit
router.get('/reasonsForVisit', async (req, res) => {
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
})

// return all call origins
router.get('/callOrigins', async (req, res) => {
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
})

// return citation numbers
router.get('/citationNumbers', async (req, res) => {
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
})

// return officer's initials
router.get('/officerInitials', async (req, res) => {
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
})

module.exports = router