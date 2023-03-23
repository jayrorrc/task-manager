import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const KEY = process.env.AUTH_CONFIG_KEY

const decodefy = (token) => {
  if (!token) {
    return false
  }

  try {
    return jwt.verify(token, KEY);
  } catch(err) {
    return false
  }
}

export default decodefy