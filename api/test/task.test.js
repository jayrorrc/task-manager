import Task from '../src/models/Task.js'
import Create from '../src/repositories/tasks/Create.js'
import Update from '../src/repositories/tasks/Update.js'

import sinon from 'sinon'
import { expect } from 'chai'

import { TASKS, USERS } from '../src/utils/constantes/index.js'

describe("Task Service Unit Tests", () => {
  afterEach(() => {
    sinon.restore();
  })

  describe("Create Task functionality", () => {
    describe(USERS.TYPES.MANAGER, () => {
      it("should not create a task", async () => {
        const admin = {
          type: USERS.TYPES.MANAGER
        }

        let error
        try {
          await Create.handle(admin, {})
        } catch (err) {
          error = err
        }

        expect(error.statusCode).to.equal(401)
        expect(error.message).to.equal('This user can not create tasks')
      })
    })

    describe(USERS.TYPES.TECHNICIAN, () => {
      it("should create a task", async () => {
        const title = 'task-1'
        const summary = 'summary-1'
        const status = TASKS.STATUS.TODO
        const owner = '1'

        const tech = {
          id: 1,
          type: USERS.TYPES.TECHNICIAN
        }

        sinon.stub(Task, 'create').returns(
          { title, summary, status, owner }
        )

        const { statusCode , data } = await Create.handle(tech, { title, summary })
        const { task } = data

        expect(statusCode).to.equal(201)
        expect(task.title).to.equal(title)
        expect(task.summary).to.equal(summary)
        expect(task.status).to.equal(status)
        expect(task.owner).to.equal(owner)
      })

      it("should create a task with diferent owner and status", async () => {
        const title = 'task-1'
        const summary = 'summary-1'
        const status = TASKS.STATUS.IN_PROGRESS
        const owner = '2'

        const tech = {
          id: 1,
          type: USERS.TYPES.TECHNICIAN
        }

        sinon.stub(Task, 'create').returns(
          { title, summary, status, owner }
        )

        const { statusCode , data } = await Create.handle(tech, { title, summary, status, owner })
        const { task } = data

        expect(statusCode).to.equal(201)
        expect(task.title).to.equal(title)
        expect(task.summary).to.equal(summary)
        expect(task.status).to.equal(status)
        expect(task.owner).to.equal(owner)
      })

      it("should not create a task without title", async () => {
        const title = ''
        const summary = 'summary-1'

        const tech = {
          id: 1,
          type: USERS.TYPES.TECHNICIAN
        }

        let error
        try {
          await Create.handle(tech, { title, summary })
        } catch (err) {
          error = err
        }

        expect(error.statusCode).to.equal(400)
        expect(error.message).to.equal('Please ensure you fill the title and summary')
      })

      it("should not create a task without summary", async () => {
        const title = 'title-1'
        const summary = ''

        const tech = {
          id: 1,
          type: USERS.TYPES.TECHNICIAN
        }

        let error
        try {
          await Create.handle(tech, { title, summary })
        } catch (err) {
          error = err
        }

        expect(error.statusCode).to.equal(400)
        expect(error.message).to.equal('Please ensure you fill the title and summary')
      })

      it(`should not create a task with a status diferent of: ${Object.values(TASKS.STATUS).join(', ')}`, async () => {
        const title = 'title-1'
        const summary = 'summary-1'
        const status = 'aaa'

        const tech = {
          id: 1,
          type: USERS.TYPES.TECHNICIAN
        }

        let error
        try {
          await Create.handle(tech, { title, summary, status })
        } catch (err) {
          error = err
        }

        expect(error.message).to.equal('Validation error: Validation isIn on status failed')
      })

      it(`should not create a task with a summary bigger than 2500 character`, async () => {
        const title = 'title-1'
        const summary = new Array(2600).join('a')

        const tech = {
          id: '1',
          type: USERS.TYPES.TECHNICIAN
        }

        let error
        try {
          await Create.handle(tech, { title, summary })
        } catch (err) {
          error = err
        }

        expect(error.message).to.equal('Validation error: Validation len on summary failed')
      })
    })
  })

  describe("Update Task functionality", () => {
    describe(USERS.TYPES.MANAGER, () => {
      it("should not update a task", async () => {
        const id = 1
        const title = 'task-1'
        const summary = 'summary-1'
        const status = TASKS.STATUS.IN_PROGRESS
        const owner = 1

        const admin = {
          type: USERS.TYPES.MANAGER
        }

        let error
        try {
          await Update.handle(
            admin,
            id,
            { title, summary, status, owner }
          )
        } catch (err) {
          error = err
        }

        expect(error.statusCode).to.equal(401)
        expect(error.message).to.equal('This user can not update this tasks')
      })
    })

    describe(USERS.TYPES.TECHNICIAN, () => {
      it("should update a task", async () => {
        const id = 1
        const title = 'task-1'
        const summary = 'summary-1'
        const status = TASKS.STATUS.IN_PROGRESS
        const owner = 1

        const tech = {
          id: 1,
          type: USERS.TYPES.TECHNICIAN
        }

        sinon.stub(Task, 'update').returns(1)
        sinon.stub(Task, 'findByPk').returns({id, owner})

        const { statusCode, data } = await Update.handle(
          tech,
          id,
          { title, summary, status, owner }
        )

        const { modified } = data
        expect(statusCode).to.equal(204)
        expect(modified).to.equal(1)
      })

      it("should not update others tasks", async () => {
        const id = 1
        const title = 'task-1'
        const summary = 'summary-1'
        const status = TASKS.STATUS.IN_PROGRESS
        const owner = 1

        const tech = {
          id: 1,
          type: USERS.TYPES.TECHNICIAN
        }

        sinon.stub(Task, 'findByPk').returns({id, owner: 2})

        let error
        try {
          await Update.handle(
            tech,
            id,
            { title, summary, status, owner }
          )
        } catch (err) {
          error = err
        }

        expect(error.statusCode).to.equal(401)
        expect(error.message).to.equal('This user can not update this tasks')
      })

      it("should not update a task without title", async () => {
        const id = 1
        const title = ''
        const summary = 'summary-1'
        const status = TASKS.STATUS.IN_PROGRESS
        const owner = 1

        const tech = {
          id: 1,
          type: USERS.TYPES.TECHNICIAN
        }

        sinon.stub(Task, 'findByPk').returns({id, owner})

        let error
        try {
          await Update.handle(
            tech,
            id,
            { title, summary, status, owner }
          )
        } catch (err) {
          error = err
        }

        expect(error.statusCode).to.equal(400)
        expect(error.message).to.equal('Please ensure you fill the title, summary, status and owner')
      })

      it("should not create a task without summary", async () => {
        const id = 1
        const title = 'task-1'
        const summary = ''
        const status = TASKS.STATUS.IN_PROGRESS
        const owner = 1

        const tech = {
          id: 1,
          type: USERS.TYPES.TECHNICIAN
        }

        sinon.stub(Task, 'findByPk').returns({id, owner})

        let error
        try {
          await Update.handle(
            tech,
            id,
            { title, summary, status, owner }
          )
        } catch (err) {
          error = err
        }

        expect(error.statusCode).to.equal(400)
        expect(error.message).to.equal('Please ensure you fill the title, summary, status and owner')
      })

      it("should not create a task without status", async () => {
        const id = 1
        const title = 'task-1'
        const summary = 'summary'
        const status = ''
        const owner = 1

        const tech = {
          id: 1,
          type: USERS.TYPES.TECHNICIAN
        }

        sinon.stub(Task, 'findByPk').returns({id, owner})

        let error
        try {
          await Update.handle(
            tech,
            id,
            { title, summary, status, owner }
          )
        } catch (err) {
          error = err
        }

        expect(error.statusCode).to.equal(400)
        expect(error.message).to.equal('Please ensure you fill the title, summary, status and owner')
      })

      it("should not update a task without owner", async () => {
        const id = 1
        const title = 'task-1'
        const summary = 'summary'
        const status = TASKS.STATUS.IN_PROGRESS
        const owner = null

        const tech = {
          id: 1,
          type: USERS.TYPES.TECHNICIAN
        }

        sinon.stub(Task, 'findByPk').returns({id, owner: 1})

        let error
        try {
          await Update.handle(
            tech,
            id,
            { title, summary, status, owner }
          )
        } catch (err) {
          error = err
        }

        expect(error.statusCode).to.equal(400)
        expect(error.message).to.equal('Please ensure you fill the title, summary, status and owner')
      })
    })
  })

  describe("Change Status Task functionality", () => {
    it("should test if MANAGERS can't chage status task", async () => {
      console.log('empty')
    })

    it("should test if TECHNICIAN can chage status own task", async () => {
      console.log('empty')
    })

    it("should test if TECHNICIAN can't chage status others task", async () => {
      console.log('empty')
    })
  })

  describe("Get Task functionality", () => {
    it("should test if MANAGERS can get any task", async () => {
      console.log('empty')
    })

    it("should test if TECHNICIAN can get own task", async () => {
      console.log('empty')
    })

    it("should test if TECHNICIAN can't get others task", async () => {
      console.log('empty')
    })
  })

  describe("List Task functionality", () => {
    it("should test if MANAGERS can get all task", async () => {
      console.log('empty')
    })

    it("should test if TECHNICIAN can get own tasks", async () => {
      console.log('empty')
    })
  })

  describe("Delete Task functionality", () => {
    it("should test if MANAGERS can delete a task", async () => {
      console.log('empty')
    })

    it("should test if TECHNICIAN can't delete a tasks", async () => {
      console.log('empty')
    })
  })
})