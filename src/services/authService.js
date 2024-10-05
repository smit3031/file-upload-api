const bcrypt = require('bcryptjs');
const User = require('../model/User');

const registerUser = async (username, email, password) => {

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  await newUser.save();

  return newUser;
};

const authenticateUser = async (email, password) => {

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error('Invalid credentials');
  }

  return user;
};

module.exports = { registerUser, authenticateUser };