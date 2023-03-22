import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config();

const KEY = process.env.AUTH_CONFIG_KEY

const Token = ({ id, username, type }) => jwt.sign(
  { id, username, type },
  KEY,
  { expiresIn: process.env.AUTH_CONFIG_TOKEN_EXPIRATION_TIME },
);

export default Token