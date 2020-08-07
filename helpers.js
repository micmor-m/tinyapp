const getUserByEmail = function(email, usersDtb) {
  // lookup magic...
  let userToReturn = {};

  if (email) {
    for (let user in usersDtb) {
      if (usersDtb[user].email === email) {
        userToReturn = usersDtb[user];
        return userToReturn;
      }
    }
  }
  return userToReturn;
};


module.exports = getUserByEmail;