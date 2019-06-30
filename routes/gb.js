const express = require("express");
const router = express.Router();
const refreshToken = require("../refresh");
const fetch = require("node-fetch");
const dt = require("node-json-transform").DataTransform;
const models = require("../models/gb");

global.Headers = fetch.Headers;

router.get("/musings", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/InnovationandPerformance/Analytics/gbgb/_api/web/lists/GetByTitle('musings')/items",
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
      res.status(200).send(dt(data, models.musing).transform());
    })
    .catch(err => res.status(500).send(err));
});

module.exports = router;
