import bcrypt from 'bcrypt'
import dotenv from 'dotenv';

import { User } from './../../models/index.js'
import Token from '../../jwt/token.js'


dotenv.config();

export default {
  async handle(payload) {
    const { username, password, type } = payload

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
        token
      }
    }
  }
}