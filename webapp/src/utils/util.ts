/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-16 15:34:21
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-16 15:36:57
 */


import { v4 as uuidv4 } from 'uuid'

class Utils {

  uuid() {
    return uuidv4()
  }
}

export default new Utils()