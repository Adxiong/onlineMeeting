/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-10 22:01:58
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-13 22:35:36
 */
import * as express from 'express';
import * as cookieParser from "cookie-parser";
import * as bodyParser from 'body-parser';
import * as session from "express-session";import * as http from 'http';
import api from './controll'
import SocketServer from './socket';

import * as cors from 'cors';
import config from './config';
import logger from './utils/logger';
const app = express()
app.use(cors())

const service = http.createServer(app)

const socket = new SocketServer(service)

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.use('/api', api)


service.listen (config.port, "0.0.0.0", () => {
  logger.info(`listen on port ${config.port};\nclick http://localhost:${config.port} to visit server;`)
})
