
const users = [];


const findUserByEmail = (email) => {
  return users.find((user) => user.email === email);
};

const createUser = (username, email, password) => {
  const newUser = { id: users.length + 1, username, email, password };
  users.push(newUser);
  return newUser;
};

module.exports = { findUserByEmail, createUser, users };

//mongodb - 4.4
//mongoose -> relationships
// gallery + comments