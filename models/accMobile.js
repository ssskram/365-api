const moment = require('moment')
const tz = require('moment-timezone')

// transforms
const dateTransform = (date) => moment(date).tz('America/New_York').format('MM-DD-YYYY, hh:mm A')
const returnLink = (uuid) => "Report/id=" + uuid

const allUsers = {
    list: 'value',
    item: {
        user: 'Email'
    }
}

const electronicIncidents = {
    list: 'value',
    item: {
        uuid: 'AdvisoryID',
        link: 'AdvisoryID',
        date: 'Created',
        address: 'Address',
        itemId: 'Id',
        coords: 'AddressID',
        reasonForVisit: 'ReasonForVisit',
        note: 'Note',
        ownersLastName: 'OwnersLastName',
        ownersFirstName: 'OwnersFirstName',
        ownersTelephoneNumber: 'OwnersTelephone',
        pghCode: 'ADVPGHCode',
        citationNumber: 'CitationNumber',
        comments: 'Comments',
        callOrigin: 'CallOrigin',
        submittedBy: 'SubmittedBy',
        modifiedBy: 'ModifiedBy',
        officerInitials: 'Officers',
        open: 'Open'
    },
    operate: [{
            'run': returnLink,
            'on': 'link'
        },
        {
            'run': dateTransform,
            'on': 'date'
        }
    ]
}

const analogIncidents = {
    list: 'value',
    item: {
        link: 'link',
        date: 'Date',
        address: 'Address',
        itemId: 'Id',
        note: 'Note'
    }
}

module.exports = {
    allUsers,
    electronicIncidents,
    analogIncidents
}