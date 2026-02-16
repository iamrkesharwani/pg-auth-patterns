import express from 'express';
import * as auth from './utils/helper.js';
const app = express();
app.use(express.json());

app.post('/create/token', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }
    const response = await auth.createSession(userId);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/create/verify', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'token required' });
    }
    const response = await auth.verifySession(token);
    if (!response) {
      return res.status(401).json({ error: 'invalid or expired token' });
    }
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const response = await auth.registerUser(name, email, password);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await auth.loginUser(email, password);
    res.status(200).json(response);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.post('/logout', async (req, res) => {
  try {
    const { token } = req.body;
    await auth.deleteSession(token);
    res.status(200).json({ message: 'Logged out' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
