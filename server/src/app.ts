/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-10 22:01:58
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-10 23:24:01
 */
import * as express from 'express';
import * as http from 'http';
import * as Socket from 'socket.io';
import * as cors from 'cors';
import config from './config';
import logger from './utils/logger';
const app = express()
app.use(cors())
const service = http.createServer(app)

const io = new Socket.Server(service)

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("message", (room, data) => {
    logger.debug("message, room: " + room + ", data, type:" + data.type);
    socket.to(room).emit("message", room, data);
  })
  socket.on("join", (room) => {
    socket.join(room);
  })
})

service.listen (config.port, () => {
  logger.info(`listen on port ${config.port};\nclick http://localhost:${config.port} to visit server;`)
})
