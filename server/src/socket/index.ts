/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-14 17:03:21
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-15 15:51:01
 */


import * as io from 'socket.io'


export default class SocketServer {
  socket: io.Server
  userList: io.Socket[] = []
  room: io.Socket[] = []

  
  constructor(server){
    this.socket =  new io.Server(server)
    this.registerEventListen()
  }
  
  registerEventListen () {
    this.socket.on('connect', (socket) => {      
      socket.on('message', (data) => this.receiveMessage(socket,data))
      socket.on('joinRoom', (data) => this.joinRoom(socket, data))
      socket.on('disconnect', (data) => this.disconnect(socket,data))
    }) 
  }

  disconnect(socket, data) {
    //给房间其他人推送，xx断开连接
  }

  receiveMessage(socket, data) {
    return JSON.parse(data)

  }

  joinRoom(socket, context) {
    //给其他人推送，xx已经加入房间
    const data = JSON.parse(context)    
    socket["nickname"] = data.nickname
    this.userList.push(socket)

    //房间里查找有无此用户，没有就加入
    const res = this.room.filter(client => client.id == socket.id)
    if(!res.length) {
      this.room.push(socket)
      socket.join()

      //给房间内所有人推送用户加入，不包括自己
      for( const client of this.room) {
        if (client.id == socket.id ) {
          return
        }
        this.sendMessage(client, {message:`${socket['nickname']}加入房间`, type:"system"})
      }
    }
  }

  sendMessage(socket, data) {
    socket.emit('message', JSON.stringify(data))
  }

  levelRoom(socket, data) {
    //给房间其他人推送，xx已经退出房间
    socket.emit('levelRoom', JSON.stringify(data))
  }
}