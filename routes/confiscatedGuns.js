const express = require("express");
const router = express.Router();
const refreshToken = require("../refresh");
const fetch = require("node-fetch");
const dt = require("node-json-transform").DataTransform;
const models = require("../models/confiscatedGuns");

global.Headers = fetch.Headers;

// returns all users
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

// returns all confiscated  gun  records
router.get("/allRecords", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/Police/ConfiscatedGuns/_api/web/lists/GetByTitle('Confiscated Guns')/items",
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
      res.status(200).send(dt(data, models.allGuns).transform());
    })
    .catch(err => res.status(500).send(err));
});

// create a confiscation record
router.post("/newRecord", async (req, res) => {
  await fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/Police/ConfiscatedGuns/_api/web/lists/GetByTitle('Confiscated Guns')/items",
    {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + (await refreshToken()),
        Accept: "application/json",
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(req.body)
    }
  )
    .then(() => res.status(200).send())
    .catch(error => res.status(500).send(error));
});

module.exports = router;
