const express = require("express");
const router = express.Router();
const refreshToken = require("../refresh");
const fetch = require("node-fetch");
const dt = require("node-json-transform").DataTransform;
const models = require("../models/ethicsTraining");

// return user's course history
router.get("/courseHistory", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/Law/EthicsTrainingAdmin/_api/web/lists/GetByTitle('Course progress')/items?$filter=Email eq '" +
      req.query.user +
      "'",
    {
      method: "GET",
      headers: new Headers({
        Authorization: "Bearer " + (await refreshToken()),
        Accept: "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        "X-RequestDigest": "form digest value"
      })
    }
  )
    .then(res => res.json())
    .then(data => {
      res.status(200).send(dt(data.d, models.course).transform());
    })
    .catch(err => res.status(500).send(err));
});

// create a course record
router.post("/newCourse", async (req, res) => {
  await fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/Law/EthicsTrainingAdmin/_api/web/lists/GetByTitle('Course progress')/items",
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
    .then(res => res.json())
    .then(data => {
      res.status(200).send({
        id: data.Id
      });
    })
    .catch(error => res.status(500).send(error));
});

// update a course record
router.post("/updateCourse", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/Law/EthicsTrainingAdmin/_api/web/lists/GetByTitle('Course progress')/items(" +
      req.query.id +
      ")",
    {
      method: "MERGE",
      headers: new Headers({
        Authorization: "Bearer " + (await refreshToken()),
        Accept: "application/json",
        "Content-Type": "application/json",
        "IF-MATCH": "*"
      }),
      body: JSON.stringify(req.body)
    }
  )
    .then(() => res.status(200).send())
    .catch(error => res.status(500).send(error));
});

// new gift disclosure
router.post("/giftDisclosure", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/Law/EthicsTrainingAdmin/_api/web/lists/GetByTitle('Gift disclosures')/items",
    {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + (await refreshToken()),
        Accept: "application/json"
      }),
      body: JSON.stringify(req.body)
    }
  )
    .then(() => res.status(200).send())
    .catch(error => res.status(500).send(error));
});

module.exports = router;
