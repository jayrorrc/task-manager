import ApiError from '../utils/ApiError/ApiError.js'

import Create from '../repositories/tasks/Create.js'
import Update from '../repositories/tasks/Update.js'
import ChangeStatus from '../repositories/tasks/ChangeStatus.js'
import Delete from '../repositories/tasks/Delete.js'
import List from '../repositories/tasks/List.js'
import Get from '../repositories/tasks/Get.js'

class TaskController {
  async create(req, res) {
    try {
      const r = await Create.handle(req.userAuth, req.body)
      res.status(r.statusCode).json({ data:  r.data })
    } catch (err) {
      console.error('error', err)

      if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ message: err.message })
      }

      res.status(500).json({ message: err.message })
    }
  }

  async update(req, res) {
    try {
      const r = await Update.handle(req.userAuth, req.params, req.body)
      res.status(r.statusCode).json({ data:  r.data })
    } catch (err) {
      console.error('error', err)

      if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ message: err.message })
      }

      res.status(500).json({ message: err.message })
    }
  }

  async changeStatus(req, res) {
    try {
      const r = await ChangeStatus.handle(req.userAuth, req.params, req.body)
      res.status(r.statusCode).json({ data:  r.data })
    } catch (err) {
      console.error('error', err)

      if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ message: err.message })
      }

      res.status(500).json({ message: err.message })
    }
  }

  async delete(req, res) {
    try {
      const r = await Delete.handle(req.userAuth, req.params)
      res.status(r.statusCode).json({ data:  r.data })
    } catch (err) {
      console.error('error', err)

      if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ message: err.message })
      }

      res.status(500).json({ message: err.message })
    }
  }

  async list(req, res) {
    try {
      const r = await List.handle(req.userAuth, req.params)
      res.status(r.statusCode).json({ data:  r.data })
    } catch (err) {
      console.error('error', err)

      if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ message: err.message })
      }

      res.status(500).json({ message: err.message })
    }
  }

  async get(req, res) {
    try {
      const r = await Get.handle(req.userAuth, req.params)
      res.status(r.statusCode).json({ data:  r.data })
    } catch (err) {
      console.error('error', err)

      if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ message: err.message })
      }

      res.status(500).json({ message: err.message })
    }
  }
}

export default new TaskController()