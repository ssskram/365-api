const express = require('express')
const router = express.Router()
const checkToken = require('../token')

// return users
router.get('/allUsers',
    function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            res.status(200).send('Got it!')
        } else res.status(403).end()
    }
)

// return all incidents
router.get('/allIncidents',
    function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            res.status(200).send('Got it!')
        } else res.status(403).end()
    }
)

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