import SingUp from '../repositories/users/SingUp.js'
import ApiError from '../utils/ApiError/ApiError.js'

class UserController {
  async singup(req, res) {
    try {
      const r = await SingUp.handle(req.body)
      res.status(201).json(r)
    } catch (err) {
      console.error('error', err)

      if (err instanceof ApiError) {
        res.status(err.statusCode).json({ message: err.message })
      }

      res.status(500).json({ message: err.message })
    }
  }
}

export default new UserController()