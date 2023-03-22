import { Task } from '../../models/index.js'

import {
  badRequest,
  unauthorized
} from '../../utils/ApiError/index.js'

export default {
  async handle(userAuth) {
    const { type } = userAuth
    const filter = {}

    if (type === 'TECHNICIAN') {
      filter.where = { owner: userAuth.id }
    }

    const tasks = await Task.findAll(filter)

    return {
      statusCode: 200,
      data: {
        tasks
      }
    }
  }
}