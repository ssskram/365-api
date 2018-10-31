const express = require('express')
const bearerToken = require('express-bearer-token')
const incidents = require('./incidents')
const animals = require('./animals')
const dropdowns = require('./dropdowns')
const users = require('./users')

require('dotenv').config()

var app = express()
app.set('port', process.env.PORT || 3000)

// logging
app.use(require('morgan')('combined'))

// bearer token
app.use(bearerToken())
const checkToken = (token) => {
  if (token == process.env.BEARER) return true
  else return false
}

/*
Incidents!
These endpoints call up Sharepoint
and return all incidents
*/

// return all incidents
app.get('/allIncidents',
  function (req, res) {
    const valid = (checkToken(req.token))
    if (valid == true) {
        incidents.allIncidents.allIncidents()
        res.status(200).send('Got it!')
    } else res.status(403).end()
  }
)

/*
Animals!
These endpoints call up Sharepoint
and return all animals
*/

// return all animals
app.get('/allAnimals',
  function (req, res) {
    const valid = (checkToken(req.token))
    if (valid == true) {

    } else res.status(403).end()
  }
)

/*
Dropdowns!
These endpoints call up Sharepoint
and return all data to populate <select> elements throughout site
*/

// return animal breeds
app.get('/animalBreeds',
  function (req, res) {
    const valid = (checkToken(req.token))
    if (valid == true) {

    } else res.status(403).end()
  }
)

// return animal coats
app.get('/animalCoats',
  function (req, res) {
    const valid = (checkToken(req.token))
    if (valid == true) {

    } else res.status(403).end()
  }
)

// return veterinarians
app.get('/vets',
  function (req, res) {
    const valid = (checkToken(req.token))
    if (valid == true) {

    } else res.status(403).end()
  }
)

// returns reasons for visit
app.get('/reasonsForVisit',
  function (req, res) {
    const valid = (checkToken(req.token))
    if (valid == true) {

    } else res.status(403).end()
  }
)

// returns call origins
app.get('/callOrigins',
  function (req, res) {
    const valid = (checkToken(req.token))
    if (valid == true) {

    } else res.status(403).end()
  }
)

// returns initials of all officers
app.get('/officerInitials',
  function (req, res) {
    const valid = (checkToken(req.token))
    if (valid == true) {

    } else res.status(403).end()
  }
)

// returns citation numbers
app.get('/citationNumbers',
  function (req, res) {
    const valid = (checkToken(req.token))
    if (valid == true) {

    } else res.status(403).end()
  }
)

/*
Users!
These endpoints call up Sharepoint
and return user group for ACC Mobile
*/

// returns user group
app.get('/userGroup',
  function (req, res) {
    const valid = (checkToken(req.token))
    if (valid == true) {

    } else res.status(403).end()
  }
)

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
})