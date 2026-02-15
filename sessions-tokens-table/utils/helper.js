import crypto from 'node:crypto';
import db from './db.js';

export const createSession = async (userId) => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
  const query = `
    INSERT INTO sessions (user_id, token, expires_at)
    VALUES ($1, $2, $3) RETURNING token;
  `;
  const response = await db.query(query, [userId, token, expiresAt]);
  return response.rows[0];
};

export const verifySession = async (token) => {
  const query = `
    SELECT user_id FROM sessions
    WHERE token = $1 AND expires_at > NOW();
  `;
  const response = await db.query(query, [token]);
  return response.rows[0];
};
