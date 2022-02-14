/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-14 16:37:17
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-14 22:56:06
 */
import * as io from 'socket.io-client';
const socket = io.connect('http://localhost:8000',{
  withCredentials: true,
  transports: ['websocket']
});


export default class SocketClient {
  url: string;
  socket?: io.Socket;

  /**
   * @param url socket connect address
   */
  constructor(url: string){
    this.url = url
  }

  connect (nickName: string) {
    this.socket = io.connect(this.url, {
      withCredentials: true,
      transports: ['websocket']
    })
    this._registerEventListen()
  }

  _registerEventListen() {
    socket.on('receiveMessage', this.receiveMessage)
    socket.on('levelRoom', this.levelRoom)
  }

  sendMessage(charInfo: {[propName: string]: string}) {
    this.socket && this.socket.emit('message',JSON.stringify(charInfo))
  }

  receiveMessage(data: any) {
    return JSON.parse(data)
  }

  joinRoom(userInfo: {[propName: string]: string}) {    
    this.socket && this.socket.emit('joinRoom', JSON.stringify(userInfo))
  }

  levelRoom(data: any) {
    return JSON.parse(data)
  }

}