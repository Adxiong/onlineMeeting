/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-10 22:40:31
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-10 22:41:52
 */

import * as log4js from 'log4js';
import * as path from 'path';

log4js.configure({
  appenders: {
    console: {
      type: 'console'
    },
    file: {
      type: 'dateFile',
      filename: path.resolve(__dirname, `../../logs/clever-compiler.log`),
      alwaysIncludePattern: true,
      daysToKeep: 5
    }
  },
  categories: {
    default: {
      appenders: ['console','file'],
      level: 'info'
    }
  },
  pm2: true
})
const logger = log4js.getLogger()
export default logger
