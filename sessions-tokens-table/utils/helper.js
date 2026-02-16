import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import db from './db.js';
const SALT_ROUNDS = 10;

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

export const registerUser = async (name, email, password) => {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const query = `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, name, email;
  `;
  const response = await db.query(query, [name, email, hash]);
  return response.rows[0];
};

export const loginUser = async (email, password) => {
  const query = 'SELECT * FROM users WHERE email = $1;';
  const response = await db.query(query, [email]);
  const user = response.rows[0];
  if (!user) throw new Error('User not found');
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new Error('Invalid password');
  await deleteExpiredSessions();
  const session = await createSession(user.id);
  return {
    name: user.name,
    email: user.email,
    userId: user.id,
    session: session.token,
  };
};

export const deleteExpiredSessions = async () => {
  const query = `
    DELETE FROM sessions
    WHERE expires_at < NOW();
  `;
  await db.query(query);
};

export const deleteSession = async (token) => {
  const query = `
    DELETE FROM sessions
    WHERE token = $1;
  `;
  await db.query(query, [token]);
};
