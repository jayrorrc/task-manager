import sinon from 'sinon'
import { expect } from "chai"

import dotenv from 'dotenv'
import { io } from "socket.io-client"

import { Task } from '../src/models/index.js'

import Create from '../src/repositories/tasks/Create.js'
import Update from '../src/repositories/tasks/Update.js'
import ChangeStatus from '../src/repositories/tasks/ChangeStatus.js'

import Token from '../src/utils/jwt/token.js'
import { NOTIFICATIONS, TASKS, USERS } from "../src/utils/constantes/index.js"

dotenv.config();
const URL = process.env.SOCKET_URL
const PORT = process.env.SOCKET_PORT
describe("Notification Unit Tests", () => {
  let socket

  const admin = {
    username: 'admin',
    password: 'admin',
    type: USERS.TYPES.MANAGER
  }

  const token = Token(admin)

  const tech = {
    id: 1,
    username: 'tech',
    password: 'tech',
    type: USERS.TYPES.TECHNICIAN
  }

  beforeEach((done) => {
    socket = io(`ws://${URL}:${PORT}`, {
      extraHeaders: {
        token
      }
    })

    socket.on("connect", done)
  })

  afterEach(() => {
    sinon.restore();
    socket.close()
  })

  describe("Create Task with status COMPLETE", () => {
    it("should send notification", (done) => {
      const title = 'task-1'
      const summary = 'summary-1'
      const status = TASKS.STATUS.COMPLETE
      const owner = tech.id
      const completedAt = Date.now()

      sinon.stub(Task, 'create').returns({
        title, summary, status, owner, completedAt
      })

      Create.handle(tech, { title, summary, status })

      socket.on(NOTIFICATIONS.QUEUES.TASK.STATUS.COMPLETE, (message) => {
        expect(message.user).to.equal(tech.username)
        expect(message.task).to.equal(title)
        expect(message.completedAt).to.equal(completedAt)

        done()
      })
    })
  })

  describe("Update Task with status COMPLETE", () => {
    it("should send notification", (done) => {
      const id = 1
      const title = 'task-1'
      const summary = 'summary-1'
      const status = TASKS.STATUS.COMPLETE
      const owner = tech.id
      const completedAt = Date.now()

      sinon.stub(Task, 'update').returns(1)
      sinon.stub(Task, 'findByPk').returns({
        id, title, summary, status, owner, completedAt
      })

      Update.handle(
        tech,
        id,
        { title, summary, status, owner }
      )

      socket.on(NOTIFICATIONS.QUEUES.TASK.STATUS.COMPLETE, (message) => {
        expect(message.user).to.equal(tech.username)
        expect(message.task).to.equal(title)
        expect(message.completedAt).to.equal(completedAt)

        done()
      })
    })
  })

  describe("Change Status Task to status COMPLETE", () => {
    it("should send notification", async () => {
      const id = 1
      const title = 'task-1'
      const summary = 'summary-1'
      const status = TASKS.STATUS.COMPLETE
      const owner = tech.id
      const completedAt = Date.now()

      sinon.stub(Task, 'update').returns(1)
      sinon.stub(Task, 'findByPk').returns({
        id, title, summary, status, owner, completedAt
      })

      ChangeStatus.handle(
        tech,
        id,
        { status }
      )

      socket.on(NOTIFICATIONS.QUEUES.TASK.STATUS.COMPLETE, (message) => {
        expect(message.user).to.equal(tech.username)
        expect(message.task).to.equal(title)
        expect(message.completedAt).to.equal(completedAt)

        done()
      })
    })
  })
})