/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-10 22:01:58
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-12 18:58:43
 */
import * as express from 'express';
import * as cookieParser from "cookie-parser";
import * as bodyParser from 'body-parser';
import * as session from "express-session";import * as http from 'http';
import * as Socket from 'socket.io';
import api from './controll'

import * as cors from 'cors';
import config from './config';
import logger from './utils/logger';
const app = express()
app.use(cors())
const service = http.createServer(app)

const io = new Socket.Server(service)

app.use('/api', api)
const SocketStore = []

io.on("connection", (socket) => {
  SocketStore.push(socket)
  console.log("a user connected",socket);
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
