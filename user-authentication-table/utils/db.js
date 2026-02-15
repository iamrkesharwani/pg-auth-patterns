import pg from 'pg';
import 'dotenv/config';
const { Pool } = pg;
const isProd = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: isProd ? { rejectUnauthorized: false } : false,
});

export default {
  query: (text, params) => pool.query(text, params),
};
