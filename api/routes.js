import express from 'express'

const routes = express.Router();

routes.get('/', (req, res) => {
  return res.json({ name: 'Ciclano Fulano' });
});

export default routes