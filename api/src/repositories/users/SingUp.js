import bcrypt from 'bcrypt'
import dotenv from 'dotenv';

import { User } from './../../models/index.js'
import Token from '../../jwt/token.js'
import {
  badRequest,
  unauthorized
} from '../../utils/ApiError/index.js'


dotenv.config();

export default {
  async handle(payload) {
    const { username, password, type } = payload

    if (!username || !password || !type) {
      throw badRequest('Please ensure you fill the username, and password')
    }

    const hasUser = await User.count({
      where: {
        username
      }
    })

    if (hasUser) {
      throw unauthorized('This user exists')
    }

    const saltRounds = parseInt(process.env.DEFULT_SALT_ROUNDS)

    const salt = await bcrypt.genSalt(saltRounds)
    const hashed = await bcrypt.hash(password, salt)

    const user = await User.create({
      username,
      password: hashed,
      type
    })

    const token = Token(user)

    return {
      data: {
        user,
        token
      }
    }
  }
}