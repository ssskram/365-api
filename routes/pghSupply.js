const express = require('express')
const router = express.Router()
const refreshToken = require('../refresh')
const fetch = require('node-fetch')

// returns true if supplied email param is contained in admin group
router.get('/isAdmin', async (req, res) => {
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
})

module.exports = router