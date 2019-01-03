const express = require('express')
const router = express.Router()
const checkToken = require('../token')
const refreshToken = require('../refresh')
const fetch = require('node-fetch')

global.Headers = fetch.Headers

// returns true if supplied email param is contained in admin group
router.get('/isAdmin',
    async function (req, res) {
        const valid = (checkToken(req.token))
        if (valid == true) {
            fetch("https://cityofpittsburgh.sharepoint.com/sites/fire/_api/web/sitegroups(440)/users?$select=Email", {
                    method: 'GET',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + await refreshToken(),
                        'Accept': 'application/json'
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data["value"].find(admin => admin.Email == req.query.user)) {
                        res.status(200).send(true)
                    } else {
                        res.status(200).send(false)
                    }
                })
                .catch(err => res.status(500).send(err))
        } else res.status(403).end()
    }
)

module.exports = router