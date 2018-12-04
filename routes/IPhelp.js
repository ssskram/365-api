const express = require('express')
const router = express.Router()
const checkToken = require('../token')
const refreshToken = require('../refresh')
const fetch = require('node-fetch')
const dt = require('node-json-transform').DataTransform
const models = require('./models/IPhelp')

global.Headers = fetch.Headers

// return list of liaisons
router.get('/allLiaisons',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/InnovationandPerformance/InPHelp/_api/web/lists/GetByTitle('Equipment')/items?$select=Title", {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    res.status(200).send(dt(data, models.allLiaisons).transform())
                })
        } else res.status(403).end()
    }
)

module.exports = router