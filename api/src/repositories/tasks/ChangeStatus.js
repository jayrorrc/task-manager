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
  async handle(userAuth, params, payload) {
    const { status } = payload
    const { id } = params

    if (!status) {
      throw badRequest('Please ensure you fill the status')
    }

    const { type } = userAuth
    const filter = {
      where: {
        id,
        owner: userAuth.id
      }
    }

    const testTask = Task.count(filter)

    if (type !== USERS.TYPES.TECHNICIAN || !testTask) {
      throw unauthorized('This user can not update this tasks ')
    }

    const data = { status }

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