/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-14 17:03:21
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-14 23:01:41
 */


import * as io from 'socket.io'


export default class SocketServer {
  socket: io.Server
  
  constructor(server){
    this.socket =  new io.Server(server)
    this.registerEventListen()
  }
  
  registerEventListen () {
    this.socket.on('connect', (socket) => {
      socket.on('message', (data) => this.receiveMessage(socket,data))
      socket.on('joinRoom', (data) => {
        console.log(data);
        
      })
      socket.on('disconnect', (data) => this.disconnect(socket,data))
    }) 
  }

  disconnect(socket, data) {
    //给房间其他人推送，xx断开连接
  }

  receiveMessage(socket, data) {
    return JSON.parse(data)
  }

  joinRoom(socket, data) {
    //给其他人推送，xx已经加入房间
    console.log('joinRoom', data);
    
  }

  sendMessage(socket, data) {
    socket.emit('message', JSON.stringify(data))
  }

  levelRoom(socket, data) {
    //给房间其他人推送，xx已经退出房间
    socket.emit('levelRoom', JSON.stringify(data))
  }
}