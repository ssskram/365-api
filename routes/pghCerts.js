const express = require("express");
const router = express.Router();
const refreshToken = require("../refresh");
const fetch = require("node-fetch");
const dt = require("node-json-transform").DataTransform;
const models = require("../models/pghCerts");

// returns all user profiles
router.get("/allUserProfile", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/certs/_api/web/lists/GetByTitle('User Profiles')/items",
    {
      method: "GET",
      headers: new Headers({
        Authorization: "Bearer " + (await refreshToken()),
        Accept: "application/json"
      })
    }
  )
    .then(res => res.json())
    .then(data =>
      res.status(200).send(dt(data, models.userProfiles).transform())
    )
    .catch(err => res.status(500).send(err));
});

// returns user profile, if existent
router.get("/userProfile", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/certs/_api/web/lists/GetByTitle('User Profiles')/items?$filter=Email eq '" +
      req.query.user +
      "'",
    {
      method: "GET",
      headers: new Headers({
        Authorization: "Bearer " + (await refreshToken()),
        Accept: "application/json"
      })
    }
  )
    .then(res => res.json())
    .then(data => {
      if (data.value.length > 0) {
        res.status(200).send(dt(data, models.userProfiles).transform());
      } else {
        res.status(404).end();
      }
    })
    .catch(err => res.status(500).send(err));
});

// creates new user profile, returns the id
router.post("/userProfile", async (req, res) => {
  await fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/certs/_api/web/lists/GetByTitle('User Profiles')/items",
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

// updates existing user profile
router.put("/userProfile", async (req, res) => {
  await fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/certs/_api/web/lists/GetByTitle('User Profiles')/items(" +
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

// returns true if supplied email param is contained in SP group
router.get("/isAdmin", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/certs/_api/web/sitegroups(8)/users?$select=Email",
    {
      method: "GET",
      headers: new Headers({
        Authorization: "Bearer " + (await refreshToken()),
        Accept: "application/json"
      })
    }
  )
    .then(res => res.json())
    .then(data => {
      if (data["value"].find(admin => admin.Email == req.query.user)) {
        res.status(200).send({
          isAdmin: true
        });
      } else {
        res.status(200).send({
          isAdmin: false
        });
      }
    })
    .catch(err => res.status(500).send(err));
});

// get list of certifications
router.get("/certTypes", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/certs/_api/web/lists/GetByTitle('Certifications')/items?$top=5000",
    {
      method: "GET",
      headers: new Headers({
        Authorization: "Bearer " + (await refreshToken()),
        Accept: "application/json"
      })
    }
  )
    .then(res => res.json())
    .then(data => {
      res.status(200).send(dt(data, models.certs).transform());
    })
    .catch(err => res.status(500).send(err));
});

// get all certification history
router.get("/certHistory", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/certs/_api/web/lists/GetByTitle('Cert History')/items?$top=5000",
    {
      method: "GET",
      headers: new Headers({
        Authorization: "Bearer " + (await refreshToken()),
        Accept: "application/json"
      })
    }
  )
    .then(res => res.json())
    .then(data => {
      res.status(200).send(dt(data, models.certHistory).transform());
    })
    .catch(err => res.status(500).send(err));
});

// new cert record
router.post("/certHistory", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/certs/_api/web/lists/GetByTitle('Cert History')/items",
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
    .then(response => response.json())
    .then(data =>
      res.status(200).send({
        entryId: data.Id
      })
    )
    .catch(error => res.status(500).send(error));
});

// update cert record
router.post("/updateCertRecord", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/certs/_api/web/lists/GetByTitle('Cert History')/items(" +
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

// delete cert record
router.delete("/deleteCertRecord", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/certs/_api/web/lists/GetByTitle('Cert History')/items(" +
      req.query.id +
      ")",
    {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + (await refreshToken()),
        Accept: "application/json",
        "IF-MATCH": "*",
        "X-HTTP-Method": "DELETE"
      })
    }
  )
    .then(() => res.status(200).send())
    .catch(error => res.status(500).send(error));
});

module.exports = router;
