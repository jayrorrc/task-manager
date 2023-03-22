import { Task } from '../../models/index.js'

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

    if (type !== 'TECHNICIAN' || !testTask) {
      throw unauthorized('This user can not update this tasks ')
    }

    const task = await Task.update(
      { status },
      filter
    )

    return {
      statusCode: 204,
      data: {
        task
      }
    }
  }
}