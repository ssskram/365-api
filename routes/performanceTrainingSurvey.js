const express = require("express");
const router = express.Router();
const refreshToken = require("../refresh");
const fetch = require("node-fetch");

// create a course record
router.post("/submission", async (req, res) => {
  await fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/InnovationandPerformance/PTS/_api/web/lists/GetByTitle('Data')/items",
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
