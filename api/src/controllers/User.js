import SingUp from "../repositories/users/SingUp.js"

class UserController {
  async singup(req, res) {
    try {
      const r = await SingUp.handle(req.body)
      res.status(201).json(r)
    } catch (err) {
      console.error('error', err)

      res.status(err.statusCode).json({ errors: err })
    }
  }
}

export default new UserController()