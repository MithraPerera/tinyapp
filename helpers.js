// Used to return user email and check if user exists in database
function getUserByEmail(emailToCheck, usersDatabase) {
  for (const user in usersDatabase) {
    if (usersDatabase[user].email === emailToCheck) {
      return user;
    }
  }
  return undefined;
}

// Returns a random string of numbers and letters
function generateRandomString() {
  const newStr = Math.random().toString(36).slice(7);
  return newStr;
}

// Return an object of objects with the user_id being the same for all sub objects
function urlsForUser(id, urlDatabase) {
  let userUrls = {};
  for (const key in urlDatabase) {
    if (urlDatabase[key]["userID"] === id) {
      userUrls[key] = urlDatabase[key]["longURL"];
    }
  }
  return userUrls;
}

module.exports = { getUserByEmail, generateRandomString, urlsForUser }