import jwt from 'jsonwebtoken'

const KEY = process.env.AUTH_CONFIG_KEY
const SECURITY_HEADER = process.env.AUTH_CONFIG_KEY_SECURITY_HEADER

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