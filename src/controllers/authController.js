const jwt = require('jsonwebtoken');
const { registerUser, authenticateUser } = require('../services/authService');

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newUser = await registerUser(username, email, password);
    res.status(201).json({ status: 'success', message: 'User registered successfully', data: { user: newUser } });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authenticateUser(email, password);
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ status: 'success', token, user });
  } catch (error) {
    res.status(401).json({ status: 'error', message: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

module.exports = { signup, login, logout };