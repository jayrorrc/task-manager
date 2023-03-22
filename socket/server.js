import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'

import decodefy from './src/utils/jwt/decodefy.js'
import { consume } from './src/utils/queue/queue.js'
import { USERS } from './src/utils/constantes/index.js'

import { NOTIFICATIONS } from './src/utils/constantes/index.js'

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.json({ name: 'We have a socket!!!' });
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    console.log("Without token");
    return next(new Error("Without token"));
  }

  const user = decodefy(token)

  if (!user) {
    console.log("Invalid token");
    return next(new Error("Invalid token"));
  }

  socket.user = user;
  next();
})
.on("connection", (socket) => {
  console.log('Socket connected')

  if (socket.user.type === USERS.TYPES.MANAGER) {
    socket.join(USERS.TYPES.MANAGER)
  }

  consume(NOTIFICATIONS.QUEUES.TASK.STATUS.COMPLETE, message => {
    console.log("Processing:", message.content);

    socket.to(USERS.TYPES.MANAGER).emit(
      NOTIFICATIONS.QUEUES.TASK.STATUS.COMPLETE,
      message.content
    )
  })
})

const PORT = process.env.SERVER_PORT
const HOST = process.env.SERVER_HOST

server.listen(
  PORT,
  HOST,
  () => console.log(`Running on http:/${HOST}:${PORT}`)
);