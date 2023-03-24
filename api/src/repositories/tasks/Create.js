import { Task } from '../../models/index.js'

import { sendToQueue } from '../../utils/queue/queue.js'

import {
  USERS,
  TASKS,
  NOTIFICATIONS
} from '../../utils/constantes/index.js'

import {
  badRequest,
  unauthorized
} from '../../utils/ApiError/index.js'

export default {
  async handle(userAuth, payload) {
    const { type, id } = userAuth
    const { title, summary, status, owner } = payload

    if (type !== USERS.TYPES.TECHNICIAN) {
      throw unauthorized('This user can not create tasks')
    }

    if (!title || !summary) {
      throw badRequest('Please ensure you fill the title and summary')
    }

    const data = {
      title,
      summary,
      status: status ? status : TASKS.STATUS.TODO,
      owner: owner ? owner : id
    }

    if (status === TASKS.STATUS.COMPLETE) {
      data.completedAt = Date.now()
    }

    const task = await Task.create(data)

    if (status === TASKS.STATUS.COMPLETE) {
      sendToQueue(NOTIFICATIONS.QUEUES.TASK.STATUS.COMPLETE, {
        user: userAuth.username,
        task: task.title,
        completedAt: task.completedAt
      });
    }

    return {
      statusCode: 201,
      data: {
        task
      }
    }
  }
}