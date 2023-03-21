import express from 'express'
import bodyParser from 'body-parser'
import logger from 'morgan'
import cors from 'cors'

import routes from './src/routes/routes.js'
import db from './src/db.js'

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

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
const HOST = process.env.SERVER_HOST

app.listen(
  PORT,
  HOST,
  () => console.log(`Running on http:/${HOST}:${PORT}`)
);