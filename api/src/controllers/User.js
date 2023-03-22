import ApiError from '../utils/ApiError/ApiError.js'
import SingUp from '../repositories/users/SingUp.js'
import SingIn from '../repositories/users/SingIn.js'

class UserController {
  async singup(req, res) {
    try {
      const r = await SingUp.handle(req.body)
      res.status(r.statusCode).json({ data:  r.data })
    } catch (err) {
      console.error('error', err)

      if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ message: err.message })
      }

      res.status(500).json({ message: err.message })
    }
  }

  async singin(req, res) {
    try {
      const r = await SingIn.handle(req.body)
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

export default new UserController()