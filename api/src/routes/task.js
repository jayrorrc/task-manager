import express from 'express'
import TaskController from "../controllers/Task.js"

const routes = express.Router()

routes.post("/", TaskController.create)
routes.get("/", TaskController.list)
routes.get("/:id", TaskController.get)
routes.put("/:id", TaskController.update)
routes.patch("/:id", TaskController.changeStatus)
routes.delete("/:id", TaskController.delete)

export default routes