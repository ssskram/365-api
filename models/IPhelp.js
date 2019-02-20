const moment = require('moment')
const tz = require('moment-timezone')

const dateTransform = (date) => moment(date).tz('America/New_York').format('MM-DD-YYYY, hh:mm A')

const allLiaisons = {
  list: 'value',
  item: {
    user: 'Title'
  }
}

const allEquipmentLoans = {
  list: 'value',
  item: {
    itemID: 'ItemID',
    from: 'From',
    to: 'To',
    pickedUp: 'PickedUp',
    returned: 'Returned'
  },
  operate: [{
    'run': dateTransform,
    'on': 'from'
  }, {
    'run': dateTransform,
    'on': 'to'
  }]
}


const allEquipment = {
  list: 'value',
  item: {
    item: 'Item',
    itemType: 'ItemType',
    location: 'Location',
    pcNumber: 'PCNumber',
    assetNumber: 'AssetNumber',
    itemID: 'Id'
  }
}

const courseRegistrations = {
  list: 'value',
  item: {
    registrationId: 'Id',
    user: 'User',
    courseCode: 'Course_x0020_Code',
    registrationStatus: 'Registration_x0020_Status'
  }
}

const courses = {
  list: 'value',
  item: {
    courseId: 'Id',
    courseCode: 'Course_x0020_Code',
    courseName: 'Course_x0020_Name',
    courseDescription: 'Course_x0020_Description',
    startDate: 'Start_x0020_Date',
    endDate: 'End_x0020_Date',
    maximumCapacity: 'Maximum_x0020_Capacity'
  },
  operate: [{
    'run': dateTransform,
    'on': 'startDate'
  }, {
    'run': dateTransform,
    'on': 'endDate'
  }]
}

module.exports = {
  allLiaisons,
  allEquipmentLoans,
  allEquipment,
  courseRegistrations,
  courses
}