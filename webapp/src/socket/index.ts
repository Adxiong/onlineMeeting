import { Socket } from 'socket.io-client';
/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-14 16:37:17
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-01 22:42:16
 */
import * as io from 'socket.io-client';
const socket = io.connect('http://localhost:8000',{
  withCredentials: true,
  transports: ['websocket']
});


export default class SocketClient {
  url: string = 'http://localhost:8000'
  socket: io.Socket | null = null

  constructor(config: {
    url: string 
  }) {    
    this.url = config.url
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

  send(type: string, data: {[propName: string]: any}) {
    this.socket && this.socket.emit(type,JSON.stringify(data))
  }

  joinRoom(userInfo: {[propName: string]: string}) {    
    this.socket && this.socket.emit('joinRoom', JSON.stringify({userInfo}))
  }
  

  level( data : {userId: string, roomId: string}) {
    this.socket && this.socket.emit('level', JSON.stringify(data))
  }

  close(data: {userId: string, roomId: string}){
    console.log('断开操作');
    this.level(data)
    
  }
}