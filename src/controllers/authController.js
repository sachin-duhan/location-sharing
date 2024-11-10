const jwt = require('jsonwebtoken');

const login = (req, res) => {
  const { username } = req.body;
  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

module.exports = { login };
