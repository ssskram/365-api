const express = require('express')
const bodyParser = require('body-parser')
const bearerToken = require('express-bearer-token')
const cors = require('cors')

// import env variables
require('dotenv').config()

// start express
var app = express()
app.set('port', process.env.PORT || 3000)

// bearer token
app.use(bearerToken())

// body parser
app.use(bodyParser.json())

// enable cors on all requests
app.use(cors())

// logging
app.use(require('morgan')('combined'))

// routes
app.use("/accmobile", require('./routes/accMobile'))
app.use("/iphelp", require('./routes/IPhelp'))

// production error handler
if (app.get('env') === 'production') {
  app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.sendStatus(err.status || 500)
  })
}

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
})