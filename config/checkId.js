const mongoose = require("mongoose");

const checkId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (isValid) return true;
  return false;
};

module.exports = checkId;
