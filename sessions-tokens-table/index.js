import express from 'express';
import * as auth from './utils/helper.js';
const app = express();
app.use(express.json());

app.post('/create/token', async (req, res) => {
  try {
    const { userId } = req.query;
    const response = await auth.createSession(userId);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/create/verify', async (req, res) => {
  try {
    const { token } = req.body;
    const response = await auth.verifySession(token);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
