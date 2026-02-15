import bcrypt from 'bcrypt';
import db from './db.js';

const SALT_ROUNDS = 10;

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

  return user;
};
