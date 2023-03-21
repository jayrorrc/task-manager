import express from 'express'
import user from './users.js'

const routes = express.Router();

routes.get('/', (req, res) => {
  return res.json({ name: 'We have an api!!!' });
});

routes.use('/user', user);

export default routes