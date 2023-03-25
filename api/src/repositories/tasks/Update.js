import { Task } from '../../models/index.js'

import { sendToQueue } from '../../utils/queue/queue.js'

import {
  USERS,
  TASKS,
  NOTIFICATIONS
} from '../../utils/constantes/index.js'

import {
  badRequest,
  notFound,
  forbidden
} from '../../utils/ApiError/index.js'

export default {
  async handle(userAuth, params, payload) {
    const { title, summary, status, owner } = payload
    const { id } = params
    const { type } = userAuth
    const filter = {
      where: {
        id,
        owner: userAuth.id
      }
    }

    if (type !== USERS.TYPES.TECHNICIAN) {
      throw forbidden('This user can not update this tasks')
    }

    const testTask = await Task.findByPk(id)
    if (!testTask) {
      throw notFound('File not found')
    }

    if (testTask.owner !== userAuth.id) {
      throw forbidden('This user can not update this tasks')
    }

    if (!title || !summary || !status || !owner) {
      throw badRequest('Please ensure you fill the title, summary, status and owner')
    }

    const data = {
      title,
      summary,
      status,
      owner
    }

    if (status === TASKS.STATUS.COMPLETE) {
      data.completedAt = Date.now()
    }

    const modified = await Task.update(data, filter)

    if (status === TASKS.STATUS.COMPLETE) {
      const task = await Task.findByPk(id)

      sendToQueue(NOTIFICATIONS.QUEUES.TASK.STATUS.COMPLETE, {
        user: userAuth.username,
        task: task.title,
        completedAt: task.completedAt
      });
    }

    return {
      statusCode: 204,
      data: {
        modified
      }
    }
  }
}