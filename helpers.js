//This helper function look if any record in the userDbt database has the given email.
//If yes return the complete object matching, if not return an empty obect.
const getUserByEmail = function(email, usersDtb) {
  
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