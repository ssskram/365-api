const express = require("express");
const router = express.Router();
const refreshToken = require("../refresh");
const fetch = require("node-fetch");
const dt = require("node-json-transform").DataTransform;
const models = require("../models/travelTrainings");

global.Headers = fetch.Headers;

// get all travel training requests
router.get("/allSubmittedItems", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/Police/_api/web/lists/GetByTitle('TravelTraining')/items",
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
      res.status(200).send(dt(data, models.travelTraining).transform());
    })
    .catch(err => res.status(500).send(err));
});

// get single item
router.get("/item", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/Police/_api/web/lists/GetByTitle('TravelTraining')/items(" +
      req.query.itemID +
      ")",
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
      res
        .status(200)
        .send(dt({ value: [data] }, models.travelTraining).transform());
    })
    .catch(err => res.status(500).send(err));
});

// updates an existing incident
router.post("/setLastNotice", async (req, res) => {
  await fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/Police/_api/web/lists/GetByTitle('TravelTraining')/items(" +
      req.query.itemID +
      ")",
    {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + (await refreshToken()),
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-HTTP-Method": "MERGE",
        "IF-MATCH": "*"
      }),
      body: JSON.stringify({
        LastNotice: req.query.lastNotice
      })
    }
  )
    .then(() => res.status(200).send())
    .catch(error => res.status(500).send(error));
});

module.exports = router;
