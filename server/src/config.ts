/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-10 22:35:55
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-10 22:40:10
 */

import * as fs from "fs";
import * as path from 'path';
import * as jsBeautify from 'js-beautify';

const configPath: string = path.resolve(__dirname, '../.config')

interface ServerConfig {
  port: number;
}

let config: ServerConfig = {
  port: 8000
}

try {
  fs.statSync(configPath)
  config = JSON.parse(fs.readFileSync(configPath).toString())
} catch (e) {
  fs.writeFileSync(configPath, jsBeautify.js(JSON.stringify(config)))
}

export default config