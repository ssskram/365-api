const express = require("express");
const router = express.Router();
const refreshToken = require("../refresh");
const fetch = require("node-fetch");
const dt = require("node-json-transform").DataTransform;
const models = require("../models/pts");

// create a course record
router.post("/submission", async (req, res) => {
  await fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/InnovationandPerformance/PTS/_api/web/lists/GetByTitle('Performance Training Survey')/items",
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

router.get("/allResponses", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/InnovationandPerformance/PTS/_api/web/lists/GetByTitle('Performance Training Survey')/items",
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
        res.status(200).send(dt(data, models.responses).transform());
    })
    .catch(err => res.status(500).send(err));
});

module.exports = router;
