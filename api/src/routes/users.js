import express from 'express';
import UserController from "../controllers/User.js";

const routes = express.Router();

routes.post("/singup", UserController.singup);

export default routes