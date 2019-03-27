const moment = require("moment");
const tz = require("moment-timezone");

const dateTransform = date =>
  moment(date)
    .tz("America/New_York")
    .format("MM-DD-YYYY, hh:mm A");

const course = {
  list: "results",
  item: {
    courseID: "Id",
    started: "Created",
    user: "User",
    email: "Email",
    organization: "Organization",
    completed: "Completed",
    progress: "Progress",
    highPoint: "HighPoint"
  },
  operate: [
    {
      run: dateTransform,
      on: "started"
    }
  ]
};

module.exports = {
  course
};
