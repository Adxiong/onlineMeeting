/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-14 17:03:21
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-26 18:26:54
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
      socket.on('addIceCandidate', (data) => this.addIceCandidate(data))
      socket.on('receiveOffer', (data) => this.receiveOffer(data))
      socket.on('receiveAnswer', (data) => this.receiveAnswer(data))
      socket.on('joinRoom', (data) => this.joinRoom(socket, data))
      socket.on('disconnect', (data) => this.disconnect(socket,data))
    }) 
  }

  addIceCandidate(content) {
    const data = JSON.parse(content)
    for( const client of this.room) {
      if ( data.user == client['name']) {
        continue
      }
      client.emit('addIceCandidate',JSON.stringify(data))
    }
  }

  receiveOffer(content) {
    const data = JSON.parse(content)
    console.log("触发",data);
    
    for( const client of this.room) {
      console.log(data.user, client['name']);
      
      if ( data.user == client['name']) {
        continue
      }
      client.emit('receiveOffer',JSON.stringify(data))
    }
  }

  receiveAnswer(content) {
    const data = JSON.parse(content)
    for( const client of this.room) {
      if ( data.user == client['name']) {
        continue
      }
      client.emit('receiveAnswer',data.answer)
    }
  }

  disconnect(socket, data) {
    //给房间其他人推送，xx断开连接
  }

  receiveRtc(socket, context) {
    const data = JSON.parse(context)
    for( const client of this.room) {
      client.emit('rtc',JSON.stringify(data))
    }
  }
  
  receiveMessage(socket, context) {
    const data = JSON.parse(context)
      
     //给房间内所有人推送消息
     for( const client of this.room) {
      this.sendMessage(client, {
        content: data.message, 
        type: data.type,
        send: data.send,
        date: new Date().getTime()

      })
    }

  }

  joinRoom(socket, context) {
    //给其他人推送，xx已经加入房间
    // console.log(socket, context);
    
    const data = JSON.parse(context)    
    socket["name"] = data.userInfo.name
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
        this.sendMessage(client, {message:`${socket['name']}加入房间`, type:"system"})
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