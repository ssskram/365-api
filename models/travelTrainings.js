const generateUrl = formTitle =>
  "https://cityofpittsburgh.sharepoint.com/sites/Police/_layouts/15/FormServer.aspx?XmlLocation=/sites/Police/TravelTraining/" +
  formTitle +
  "&ClientInstalled=false&DefaultItemOpen=1&Source=https%3A%2F%2Fcityofpittsburgh%2Esharepoint%2Ecom%2Fsites%2FPolice%2FTravelTraining%2FForms%2FAllItems%2Easpx";

const formatCurrency = amountRequested => "$" + amountRequested.toFixed(2);

const parseEmail = accountID =>
  accountID ? accountID.replace(/([^\|]*\|){2}/, "") : null;

const travelTraining = {
  list: "value",
  item: {
    id: "Id",
    url: "Title",
    officerName: "Officer_x0020_Name",
    submitted: "Created",
    amountRequested: "Total_x0020_Amount_x0020_Requested",
    firstForward: "FirstForward",
    firstApprovalSignature: "First_x0020_Approval_x0020_Signature",
    secondForward: "SecondForward",
    secondApprovalSignature: "Second_x0020_Approval_x0020_Signature",
    thirdForward: "ThirdForward",
    thirdApprovalSignature: "Third_x0020_Approval_x0020_Signature",
    fourthForward: "FourthForward",
    fourthApprovalSignature: "Fourth_x0020_Approval_x0020_Signature",
    fifthForward: "FifthForward",
    fifthApprovalSignature: "Fifth_x0020_Approval_x0020_Signature",
    finalForward: "FinalForward",
    finalApprovalSignature: "Final_x0020_Approval_x0020_Signature",
    lastNotice: "LastNotice",
    finalDenial: "Final_x0020_Denial",
    finalApproval: "Final_x0020_Approval",
    daysOnly: "Days_x0020_Only"
  },
  operate: [
    {
      run: generateUrl,
      on: "url"
    },
    {
      run: formatCurrency,
      on: "amountRequested"
    },
    {
      run: parseEmail,
      on: "firstForward"
    },
    {
      run: parseEmail,
      on: "secondForward"
    },
    {
      run: parseEmail,
      on: "thirdForward"
    },
    {
      run: parseEmail,
      on: "fourthForward"
    },
    {
      run: parseEmail,
      on: "fifthForward"
    },
    {
      run: parseEmail,
      on: "finalForward"
    }
  ]
};

module.exports = {
  travelTraining
};
