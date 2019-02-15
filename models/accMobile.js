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
        reasonForVisit: 'ReasonforVisit',
        note: 'Note',
        ownersLastName: 'OwnersLastName',
        ownersFirstName: 'OwnersFirstName',
        ownersTelephoneNumber: 'OwnersTelephone',
        pghCode: 'ADVPGHCode',
        citationNumber: 'CitationNumber',
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
        address: 'address',
        itemId: 'Id',
        note: 'Note'
    }
}

const attachments = {
    list: 'value',
    item: {
        incidentID: 'incidentID',
        relativePath: 'relativePath',
        imageTitle: 'attachmentTitle',
        imageDescription: 'attachmentDescription',
        itemId: 'Id'
    }
}

const animals = {
    list: 'value',
    item: {
        itemID: 'Id',
        incidentID: 'AdvisoryID',
        animalName: 'Name',
        animalType: 'Type',
        animalBreed: 'Breed',
        animalCoat : 'Coat',
        animalSex: 'Sex',
        animalAge: 'Age',
        LicenseNo: 'LicenseNumber',
        LicenseYear: 'LicenseYear',
        RabbiesVacNo: 'RabbiesVacNo',
        RabbiesVacExp: 'RabbiesVacExp',
        Vet: 'Veterinarian',
        Comments: 'Comments'
    }
}

const animalBreeds = {
    list: 'value',
    item: {
        breed: 'breed',
        type: 'AnimalType'
    }
}

const animalCoats = {
    list: 'value',
    item: {
        coat: 'Coat',
        type: 'AnimalType'
    }
}

const vets = {
    list: 'value',
    item: {
        vet: 'Vet'
    }
}

const reasonsForVisit = {
    list: 'value',
    item: {
        reason: 'Reason'
    }
}

const callOrigins = {
    list: 'value',
    item: {
        origin: 'Origin'
    }
}

const citationNumbers = {
    list: 'value',
    item: {
        citation: 'Number'
    }
}

const officerInitials = {
    list: 'value',
    item: {
        initial: 'Initials'
    }
}

const comments = {
    list: 'value',
    item: {
        dateTime: 'dateTime',
        incidentID: 'incidentID',
        user: 'user',
        comment: 'comment'
    }
}

module.exports = {
    allUsers,
    electronicIncidents,
    analogIncidents,
    animals,
    animalBreeds,
    animalCoats,
    vets,
    reasonsForVisit,
    callOrigins,
    citationNumbers,
    officerInitials,
    attachments,
    comments
}