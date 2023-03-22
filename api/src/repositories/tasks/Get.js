import { Task } from '../../models/index.js'

import {
  badRequest,
  unauthorized
} from '../../utils/ApiError/index.js'

export default {
  async handle(userAuth, params) {
    const { id } = params

    const { type } = userAuth
    const filter = {
      where: {
        id,
      }
    }

    if (type === 'TECHNICIAN') {
      filter.where.owner = userAuth.id
    }

    const testTask = Task.count(filter)
    if(!testTask) {
      throw unauthorized('This user can not update this tasks ')
    }

    const task = await Task.findOne(filter)

    return {
      statusCode: 200,
      data: {
        task
      }
    }
  }
}