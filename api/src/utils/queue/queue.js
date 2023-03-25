import amqp from 'amqplib'
import dotenv from 'dotenv'

dotenv.config()

const connect = () => {
  const url = process.env.RABBITMQ_URL
  const user = process.env.RABBITMQ_USER
  const password = process.env.RABBITMQ_USER_PASSWORD

  return amqp.connect(`amqp://${user}:${password}@${url}`)
    .then(conn => conn.createChannel())
}

const createQueue = (channel, queue) => {
  return new Promise((resolve, reject) => {
    try{
      channel.assertQueue(queue, { durable: true })
      resolve(channel)
    }
    catch(err){ reject(err) }
  })
}

const sendToQueue = (queue, message) => {
  connect()
    .then(channel => createQueue(channel, queue))
    .then(channel => channel.sendToQueue(queue, Buffer.from(JSON.stringify(message))))
    .catch(err => console.error(err))
}

const consume = (queue, callback) => {
  connect()
    .then(channel => createQueue(channel, queue))
    .then(channel => channel.consume(queue, callback, { noAck: true }))
    .catch(err => console.error(err))
}

export {
  sendToQueue,
  consume
}