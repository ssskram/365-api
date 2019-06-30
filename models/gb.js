const seperateToObject = musing => {
  const operand = identifyBreaks(musing);
  const splitzies = musing.split(operand);
  let obj;
  splitzies.length == 1
    ? (obj = { body: splitzies[0].trim() })
    : (obj = {
        title: splitzies[0].trim(),
        body: splitzies[1].trim()
      });
  return obj;
};

const identifyBreaks = musing => {
  const beginningOfString = musing.substring(0, 40);
  if (beginningOfString.includes("-")) {
    return "-";
  } else if (beginningOfString.includes(":")) {
    return ":";
  } else if (beginningOfString.includes("=")) {
    return "=";
  } else return null;
};

const musing = {
  list: "value",
  item: {
    musing: "musing"
  },
  operate: [
    {
      run: seperateToObject,
      on: "musing"
    }
  ]
};

module.exports = {
  musing
};
