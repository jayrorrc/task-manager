import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
import sinon from 'sinon'
import User from '../src/models/User.js';
import { expect } from 'chai'

import { USERS } from '../src/utils/constantes/index.js'
import SignUp from '../src/repositories/users/SignUp.js';

const KEY = process.env.AUTH_CONFIG_KEY

dotenv.config();

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
      console.log('empty')
    })
  })
})
