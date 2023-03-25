import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'

import decodefy from './src/utils/jwt/decodefy.js'
import { consume } from './src/utils/queue/queue.js'
import { USERS } from './src/utils/constantes/index.js'

import { NOTIFICATIONS } from './src/utils/constantes/index.js'

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = new Server(server)

app.get('/', (req, res) => {
  res.json({ name: 'We have a socket!!!' })
})

io.use((socket, next) => {
  const token = socket.handshake.headers.token

  if (!token) {
    console.error("Without token")
    return next(new Error("Without token"))
  }

  const user = decodefy(token)

  if (!user) {
    console.error("Invalid token")
    return next(new Error("Invalid token"))
  }

  socket.user = user
  next()
})
.on("connection", (socket) => {
  console.log('Socket connected')

  socket.join(socket.user.type)
})

consume(NOTIFICATIONS.QUEUES.TASK.STATUS.COMPLETE, message => {
  const buf = message.content
  const data = JSON.parse(buf.toString())

  console.log(
    `Processing[${NOTIFICATIONS.QUEUES.TASK.STATUS.COMPLETE}]:`,
    buf.toString()
  )

  io.to(USERS.TYPES.MANAGER).emit(
    NOTIFICATIONS.QUEUES.TASK.STATUS.COMPLETE,
    data
  )
})

const PORT = process.env.SERVER_PORT
const HOST = process.env.SERVER_HOST

server.listen(
  PORT,
  HOST,
  () => console.log(`Running on http:/${HOST}:${PORT}`)
)