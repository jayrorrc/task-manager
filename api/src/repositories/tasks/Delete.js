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

    if (type !== USERS.TYPES.MANAGER) {
      throw unauthorized('This user can not delete this tasks ')
    }

    const modified = await Task.destroy({
      where: {
        id,
      },
    })

    return {
      statusCode: 204,
      data: {
        modified
      }
    }
  }
}