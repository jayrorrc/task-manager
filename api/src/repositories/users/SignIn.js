import bcrypt from 'bcrypt'
import dotenv from 'dotenv';

import { User } from '../../models/index.js'
import Token from '../../utils/jwt/token.js'
import {
  badRequest,
  unauthorized,
  notFound,
} from '../../utils/ApiError/index.js'

dotenv.config();

export default {
  async handle(payload) {
    const { username, password } = payload

    if (!username || !password) {
      throw badRequest('Please ensure you fill the username and password')
    }

    const user = await User.findOne({
      where: {
        username
      }
    })

    if (!user) {
      throw notFound('User not found')
    }

    const testPassWord = await bcrypt.compare(password, user.password)

    if (!testPassWord) {
      throw unauthorized('Wrong password')
    }

    const token = Token(user)

    return {
      statusCode: 200,
      data: {
        token
      }
    }
  }
}