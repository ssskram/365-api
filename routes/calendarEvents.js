const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const toBody = require("../util/objectToParams");

// new calendar event
router.post("/newEvent", async (req, res) => {
  fetch(
    "https://graph.microsoft.com/v1.0/users/" +
      req.query.user +
      "/calendar/events",
    {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + (await calendarToken()),
        Accept: "application/json",
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(req.body)
    }
  )
    .then(response => response.json())
    .then(data => res.status(200).send(data.id))
    .catch(err => res.status(500).send(err));
});

// delete calendar event
router.post("/deleteEvent", async (req, res) => {
  fetch(
    "https://graph.microsoft.com/v1.0/users/" +
      req.query.user +
      "/calendar/events/" +
      req.query.eventId,
    {
      method: "DELETE",
      headers: new Headers({
        Authorization: "Bearer " + (await calendarToken())
      })
    }
  )
    .then(() => res.status(200).end())
    .catch(err => res.status(500).send(err));
});

const calendarToken = async () => {
  const params = {
    grant_type: process.env.OUTLOOK_TYPE,
    client_id: process.env.OUTLOOK_ID,
    client_secret: process.env.OUTLOOK_SECRET,
    scope: process.env.OUTLOOK_SCOPE
  };
  const token = await fetch(
    "https://login.microsoftonline.us/f5f47917-c904-4368-9120-d327cf175591/oauth2/v2.0/token",
    {
      method: "post",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded"
      }),
      body: toBody(params)
    }
  );
  const response = await token.json();
  return response.access_token;
};

module.exports = router;
