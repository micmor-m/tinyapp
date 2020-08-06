const getUserByEmail = function(email, usersDtb) {
  // lookup magic...
  let userToReturn = {};

  if (email) {
    for (let user in usersDtb) {
      console.log("getUserByEmail -User", user)
      console.log("getUserByEmail - User email", usersDtb[user].email)
      if (usersDtb[user].email === email) {
        console.log("getUserByEmail - yes there is this email")
        userToReturn = usersDtb[user];
        return userToReturn;
      }
    }
  }
  return userToReturn;
};


module.exports = getUserByEmail;