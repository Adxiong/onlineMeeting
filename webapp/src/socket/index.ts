import { Socket } from 'socket.io-client';
/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-14 16:37:17
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-03 18:10:14
 */
import * as io from 'socket.io-client';
const socket = io.connect('http://localhost:8000',{
  withCredentials: true,
  transports: ['websocket']
});


export default class SocketClient {
  url: string = 'http://localhost:8000'
  socket: io.Socket | null = null

  constructor(signalServer: string) {    
    this.url = signalServer
    this.connect()
  }
  
  connect () {
    //存在socket 便不用重新连接
    if (this.socket) return
    
    this.socket = io.connect(this.url, {
      withCredentials: true,
      transports: ['websocket'],
    })
  }

  on(ev: string, cb:(...args: any[]) => void){
    console.log(`注册${ev}事件成功`);
    
    this.socket && this.socket.on(ev, cb)
  }

  sendMessage(chatInfo: {[propName: string]: string}) {
    this.socket && this.socket.emit('message',JSON.stringify(chatInfo))
  }

  send(data: string) {
    this.socket && this.socket.send(data)
  }

  joinRoom(userInfo: {[propName: string]: string}) {    
    this.socket && this.socket.emit('joinRoom', JSON.stringify({userInfo}))
  }
  

  level() {
    this.socket && this.socket.emit('level', JSON.stringify(""))
  }

  close(){
    console.log('断开操作');
    this.level()
    this.socket?.close()
  }
}