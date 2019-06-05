const express = require("express");
const router = express.Router();
const refreshToken = require("../refresh");
const fetch = require("node-fetch");
const dt = require("node-json-transform").DataTransform;
const models = require("../models/confiscatedGuns");

global.Headers = fetch.Headers;

router.get("/allUsers", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/Police/ConfiscatedGuns/_api/web/sitegroups(626)/users?$select=Email",
    {
      method: "get",
      headers: new Headers({
        Authorization: "Bearer " + (await refreshToken()),
        Accept: "application/json"
      })
    }
  )
    .then(res => res.json())
    .then(data => {
      res.status(200).send(dt(data, models.allUsers).transform());
    })
    .catch(err => res.status(500).send(err));
});

module.exports = router;
