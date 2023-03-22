import { Task } from '../../models/index.js'

import {
  badRequest,
  unauthorized
} from '../../utils/ApiError/index.js'

export default {
  async handle(userAuth, params, payload) {
    const { title, summary, status, owner } = payload
    const { id } = params

    if (!title || !summary || !status || !owner) {
      throw badRequest('Please ensure you fill the title, summary, status and owner')
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

    const modified = await Task.update(
      {
        title,
        summary,
        status,
        owner
      },
      filter
    )

    return {
      statusCode: 204,
      data: {
        modified
      }
    }
  }
}