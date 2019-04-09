const userProfiles = {
  list: "value",
  item: {
    id: "Id",
    email: "Email",
    department: "Department",
    title: "Title"
  }
};

const certs = {
  list: "value",
  item: {
    certID: "Certification_x0020_ID",
    certName: "Certification"
  }
};

const certHistory = {
  list: "value",
  item: {
    entryId: "Id",
    user: "User",
    certId: "Certification_x0020_ID",
    iccExp: "ICC_x0020_Exp",
    uccExp: "UCC_x0020_Exp"
  }
};

module.exports = {
  userProfiles,
  certs,
  certHistory
};
