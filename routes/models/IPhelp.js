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

module.exports = {
  allLiaisons,
allEquipmentLoans}
