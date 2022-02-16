import { Socket } from 'socket.io-client';
/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-14 16:37:17
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-16 17:09:15
 */
import * as io from 'socket.io-client';
const socket = io.connect('http://localhost:8000',{
  withCredentials: true,
  transports: ['websocket']
});


export default class SocketClient {
  url: string = 'http://localhost:8000'
  socket: io.Socket | null = null

  connect () {
    //存在socket 便不用重新连接
    if (this.socket) return
    this.socket = io.connect(this.url, {
      withCredentials: true,
      transports: ['websocket'],
    })
  }

  on(ev: string, cb:(...args: any[]) => void){
    this.socket && this.socket.on(ev, cb)
  }

  sendMessage(charInfo: {[propName: string]: string}) {
    this.socket && this.socket.emit('message',JSON.stringify(charInfo))
  }

  joinRoom(userInfo: {[propName: string]: string}) {    
    this.socket && this.socket.emit('joinRoom', JSON.stringify({userInfo}))
  }
}