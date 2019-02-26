const userProfiles = {
    list: 'value',
    item: {
        id: 'Id',
        email: 'Email',
        department: 'Department',
        title: 'Title'
    }
}

const certs = {
    list: 'value',
    item: {
        certID: 'Certification_x0020_ID',
        certName: 'Certification',
        ICC: 'ICC',
        UCC: 'UCC'
    }
}

const certHistory = {
    list: 'value',
    item: {
        entryId: 'Id',
        user: 'User',
        certId: 'Certification_x0020_ID',
        date: 'Date'
    }
}

module.exports = {
    userProfiles,
    certs,
    certHistory
}