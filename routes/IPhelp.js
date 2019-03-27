const express = require("express");
const router = express.Router();
const checkToken = require("../token");
const refreshToken = require("../refresh");
const fetch = require("node-fetch");
const dt = require("node-json-transform").DataTransform;
const models = require("../models/IPhelp");

global.Headers = fetch.Headers;

/*
SECTION
I&P liaisons, access control
*/

router.get("/allLiaisons", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/InnovationandPerformance/InPHelp/_api/web/lists/GetByTitle('Equipment')/items?$select=Title,department",
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
      res.status(200).send(dt(data, models.allLiaisons).transform());
    })
    .catch(err => res.status(500).send(err));
});

/*
SECTION
Equipment loan module
*/

// return all equipment loans
router.get("/allEquipmentLoans", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/InnovationandPerformance/EquipmentLoan/_api/web/lists/GetByTitle('Reservations')/items",
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
      res.status(200).send(dt(data, models.allEquipmentLoans).transform());
    })
    .catch(err => res.status(500).send(err));
});

// return all equipment
router.get("/allEquipment", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/InnovationandPerformance/EquipmentLoan/_api/web/lists/GetByTitle('Equipment')/items",
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
      res.status(200).send(dt(data, models.allEquipment).transform());
    })
    .catch(err => res.status(500).send(err));
});

// create a new loan record
router.post("/newEquipmentLoan", async (req, res) => {
  await fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/InnovationandPerformance/EquipmentLoan/_api/web/lists/GetByTitle('Reservations')/items",
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

/*
SECTION
Course registrations
*/

// get all course registrations
router.get("/allCourseRegistrations", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/InnovationandPerformance/CourseRegistration/_api/web/lists/GetByTitle('Registrations')/items",
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
      res.status(200).send(dt(data, models.courseRegistrations).transform());
    })
    .catch(err => res.status(500).send(err));
});

// get all courses
router.get("/allCourses", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/InnovationandPerformance/CourseRegistration/_api/web/lists/GetByTitle('Courses')/items",
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
      res.status(200).send(dt(data, models.courses).transform());
    })
    .catch(err => res.status(500).send(err));
});

// get specific course
router.get("/course", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/InnovationandPerformance/CourseRegistration/_api/web/lists/GetByTitle('Courses')/items?$filter=Course_x0020_Code eq '" +
      req.query.courseCode +
      "'",
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
      res.status(200).send(dt(data, models.courses).transform());
    })
    .catch(err => res.status(500).send(err));
});

// create a course registration record
router.post("/newCourseRegistration", async (req, res) => {
  await fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/InnovationandPerformance/CourseRegistration/_api/web/lists/GetByTitle('Registrations')/items",
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

// update a course registration record
router.post("/updateCourseRegistration", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/InnovationandPerformance/CourseRegistration/_api/web/lists/GetByTitle('Registrations')/items(" +
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

// get calendar event
router.get("/courseRegistrationCalendarEvent", async (req, res) => {
  fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/InnovationandPerformance/CourseRegistration/_api/web/lists/GetByTitle('Calendar Events')/items?$filter=Registration_x0020_ID eq '" +
      req.query.registrationID +
      "'",
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
      res.status(200).send(dt(data, models.calendarEvent).transform());
    })
    .catch(err => res.status(500).send(err));
});

// create a calendar event record
router.post("/courseRegistrationCalendarEvent", async (req, res) => {
  await fetch(
    "https://cityofpittsburgh.sharepoint.com/sites/InnovationandPerformance/CourseRegistration/_api/web/lists/GetByTitle('Calendar Events')/items",
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
