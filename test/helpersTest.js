const { assert } = require('chai');
const { getUserByEmail } = require('../helpers');

// TEST DATA
const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// Testing the getUserByEmail Helper Function
describe('getUserByEmail', function() {
  // TEST CASE 1
  it('should return a user with a valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user, expectedUserID);
  });
  // TEST CASE 2
  it('should return undefined for an email that does not exist in database', function() {
    const user = getUserByEmail("mithra@example.com", testUsers);
    const expectedUserID = undefined;
    assert.equal(user, expectedUserID);
  });
});