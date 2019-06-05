const moment = require("moment");
const tz = require("moment-timezone");

const dateTransform = date =>
  moment(date)
    .tz("America/New_York")
    .format("MM-DD-YYYY, hh:mm A");

const allUsers = {
  list: "value",
  item: {
    user: "Email"
  }
};

const allGuns = {
  list: "value",
  item: {
    serialNumber: "serialNumber",
    gunMake: "gunMake",
    gunModel: "gunModel",
    gunCaliber: "gunCaliber",
    dateOfRecovery: "dateOfRecovery",
    gunType: "gunType",
    originatingAgencyCaseNumber: "originatingAgencyCaseNumber",
    linkageAgencyIdentifier: "linkageAgencyIdentifier",
    linkageAgencyCaseNumber: "linkageAgencyCaseNumber",
    notifyOriginatingAgency: "notifyOriginatingAgency",
    miscellaneous: "miscellaneous",
    name: "name",
    dateOfBirth: "dateOfBirth",
    operatorsLicenseNumber: "operatorsLicenseNumber",
    operatorsLicenseNumber: "operatorsLicenseNumber",
    licenseState: "licenseState",
    possessedByProhibitedPerson: "possessedByProhibitedPerson",
    chargedWithCrime: "chargedWithCrime",
    permitInLTC: "permitInLTC",
    createdBy: "createdBy",
    created: "Created"
  },
  operate: [
    {
      run: dateTransform,
      on: "created"
    }
  ]
};

module.exports = {
  allUsers,
  allGuns
};
