import express from 'express'
import user from './users.js'
import task from './task.js'
import verifytoken from '../utils/jwt/verifytoken.js';


const routes = express.Router();

routes.get('/', (req, res) => {
  return res.json({ name: 'We have an api!!!' });
});

routes.use('/user', user);
routes.use('/task', verifytoken, task);

export default routes