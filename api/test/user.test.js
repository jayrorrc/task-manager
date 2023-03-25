import jwt from 'jsonwebtoken'
import sinon from 'sinon'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import { expect } from 'chai'

import User from '../src/models/User.js'
import SignUp from '../src/repositories/users/SignUp.js'
import SignIn from '../src/repositories/users/SignIn.js'

import { USERS } from '../src/utils/constantes/index.js'

dotenv.config();
const KEY = process.env.AUTH_CONFIG_KEY

describe("User Service Unit Tests", () => {
  afterEach(() => {
    sinon.restore();
  })

  describe("Sign Up User functionality", () => {
    it("should create a user", async () => {
      const username = 'admin'
      const password = 'admin'
      const type = USERS.TYPES.MANAGER

      sinon.stub(User, 'count').returns(0)
      sinon.stub(User, 'create').returns({
        id: 1, username, type
      })

      const { statusCode , data } = await SignUp.handle({ username, password, type })
      const { token } = data

      const user = jwt.verify(token, KEY)

      expect(statusCode).to.equal(201)
      expect(user.username).to.equal(username)
      expect(user.type).to.equal(type)
    })

    it("should not create a user without a username", async () => {
      const username = ''
      const password = 'admin'
      const type = USERS.TYPES.MANAGER

      let error
      try {
        await SignUp.handle({ username, password, type })
      } catch (err) {
        error = err
      }

      expect(error.statusCode).to.equal(400)
      expect(error.message).to.equal('Please ensure you fill the username, password and type')
    })

    it("should not create a user without a password", async () => {
      const username = 'admin'
      const password = ''
      const type = USERS.TYPES.MANAGER

      let error
      try {
        await SignUp.handle({ username, password, type })
      } catch (err) {
        error = err
      }

      expect(error.statusCode).to.equal(400)
      expect(error.message).to.equal('Please ensure you fill the username, password and type')
    })

    it("should not create a user without a type", async () => {
      const username = 'admin'
      const password = 'admin'
      const type = ''

      let error
      try {
        await SignUp.handle({ username, password, type })
      } catch (err) {
        error = err
      }

      expect(error.statusCode).to.equal(400)
      expect(error.message).to.equal('Please ensure you fill the username, password and type')
    })

    it(`should not create a user with a type different from ${Object.values(USERS.TYPES).join(', ')}`, async () => {
      const username = 'admin'
      const password = 'admin'
      const type = 'aa'

      sinon.stub(User, 'count').returns(0)

      let error
      try {
        await SignUp.handle({ username, password, type })
      } catch (err) {
        error = err
      }

      expect(error.message).to.equal('Validation error: Validation isIn on type failed')
    })

    it("should not create a user with a repeated username", async () => {
      const username = 'admin'
      const password = 'admin'
      const type = USERS.TYPES.MANAGER

      sinon.stub(User, 'count').returns(1)

      let error
      try {
        await SignUp.handle({ username, password, type })
      } catch (err) {
        error = err
      }

      expect(error.statusCode).to.equal(401)
      expect(error.message).to.equal('This user alread exists')
    })
  })

  describe("Sign In User functionality", () => {
    it("should return a valid jwt token", async () => {
      const username = 'admin'
      const password = 'admin'
      const type = USERS.TYPES.MANAGER

      const saltRounds = parseInt(process.env.DEFULT_SALT_ROUNDS)

      const salt = await bcrypt.genSalt(saltRounds)
      const hashed = await bcrypt.hash(password, salt)

      sinon.stub(User, 'findOne').returns({
        id: 1,
        username,
        type,
        password: hashed
      })

      const { statusCode , data } = await SignIn.handle({ username, password, type })
      const { token } = data

      const user = jwt.verify(token, KEY)

      expect(statusCode).to.equal(200)
      expect(user.username).to.equal(username)
      expect(user.type).to.equal(type)
    })

    it("should not sign in with wrong password", async () => {
      const username = 'admin'
      const password = 'admin'
      const type = USERS.TYPES.MANAGER

      const saltRounds = parseInt(process.env.DEFULT_SALT_ROUNDS)

      const salt = await bcrypt.genSalt(saltRounds)
      const hashed = await bcrypt.hash(password, salt)

      sinon.stub(User, 'findOne').returns({
        id: 1,
        username,
        type,
        password: hashed
      })

      let error
      try {
        await SignIn.handle({
          username,
          password: '123',
          type
        })
      } catch (err) {
        error = err
      }

      expect(error.statusCode).to.equal(401)
      expect(error.message).to.equal('Wrong password')
    })
  })
})
