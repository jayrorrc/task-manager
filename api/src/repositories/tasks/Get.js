import { Task } from '../../models/index.js'

import {
  USERS,
} from '../../utils/constantes/index.js'

import {
  unauthorized
} from '../../utils/ApiError/index.js'

export default {
  async handle(userAuth, params) {
    const { id } = params
    const { type } = userAuth

    const task = await Task.findByPk(id)
    if (!task) {
      throw notFound('File not found')
    }

    if (task.owner !== userAuth.id && type == USERS.TYPES.TECHNICIAN) {
      throw unauthorized('This user can not get this tasks')
    }

    return {
      statusCode: 200,
      data: {
        task
      }
    }
  }
}