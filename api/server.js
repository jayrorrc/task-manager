import express from 'express'
import routes from './routes.js'
import db from './src/db.js'

const app = express();

app.use(express.json());
app.use(routes);

db.authenticate()
.then(() => {
  console.log(`Connection has been established successfully to database: ${process.env.DB_NAME}`);
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
})

db.sync(() => console.log(`Database synced`));

const PORT = process.env.SERVER_PORT
app.listen(PORT, () => console.log(`Servidor iniciado na porta ${PORT}`));