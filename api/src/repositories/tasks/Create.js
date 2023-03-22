import { Task } from '../../models/index.js'

import {
  badRequest,
  unauthorized
} from '../../utils/ApiError/index.js'

export default {
  async handle(userAuth, payload) {
    const { title, summary, status, owner } = payload

    if (!title || !summary) {
      throw badRequest('Please ensure you fill the title and summary')
    }

    const { type } = userAuth
    if (type !== 'TECHNICIAN') {
      throw unauthorized('This user can not create tasks ')
    }

    const task = await Task.create({
      title,
      summary,
      status: status ? status : 'TODO',
      owner: owner ? owner : userAuth.id
    })

    return {
      statusCode: 201,
      data: {
        task
      }
    }
  }
}