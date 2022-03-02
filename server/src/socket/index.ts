/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-14 17:03:21
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-02 18:09:21
 */


import { levels } from 'log4js'
import * as io from 'socket.io'
import logger from '../utils/logger'

interface SocketClientType {
  userInfo: {
    id: string,
    nick: string
  },
  roomId: string
}

export default class SocketServer {
  socket: io.Server

  constructor(server){
    this.socket =  new io.Server(server)
    this.registerEventListen()
  }
  
  registerEventListen () {
    this.socket.on('connect', (socket) => { 
      socket['userInfo'] = {
        id: socket.id
      }   
      if( !this.socket['client']) this.socket['client'] = []       
      this.socket['client'].push(socket)
      socket.on('joinRoom', (data) => this.joinRoom(socket, JSON.parse(data)))
      socket.on('disconnect', () => this.disConnect(socket))
      socket.on('message', (data) => {
        console.log(data);

        this.boradCaseToRoom({
          id: socket.id,
          roomId: socket['userInfo']['roomId']
        }, data)
      })
    }) 
  }
 

  disConnect(socket) {
    
    console.log(`${socket["userInfo"].nick} 退出`);

    this.socket['client'] = this.socket['client'].filter( client => client['userInfo'].id != socket['userInfo'].id )
    
    
  }
  joinRoom(socket: io.Socket, data) {
    const userInfo = {
      id: socket['userInfo'].id,
      nick: data.userInfo.nick,
      roomId: data.userInfo.roomId
    }
    logger.info(`id=${userInfo.id} 的 ===》 ${userInfo.nick} 加入房间 ${userInfo.roomId}`)

    socket['userInfo'] = userInfo
        
    const roomUserList = this.getRoomUserList(userInfo.roomId)
    

    this.sendToRoom(userInfo, 
      {
        type: "roomInfo",
        payload: {
          roomUserList: roomUserList,
          userInfo: userInfo
        }
      } 
    )

  }

  getRoomUserList (roomId) {    
    return Array.from(this.socket['client'])
    .map( client => client['userInfo'])
    .filter( userInfo => userInfo.roomId == roomId)
  }

 
  sendToRoom (userInfo, data) {
    this.socket['client'].forEach( client => {
      if (client['userInfo']['roomId'] == userInfo.roomId ) {        
        client.send(JSON.stringify(data))
      }
    });
  }

  boradCaseToRoom (userInfo, data) {
    this.socket['client'].forEach( client => {
      if (client['userInfo']['roomId'] == userInfo.roomId && client['userInfo']['id'] != userInfo.id ) {        
        client.send(data)
      }
    });
  }

  sendToUser (receiveId, data  ) {
    this.socket['client'].forEach( client => {
      if (client['userInfo']['userId'] == receiveId) {
        client.send(JSON.stringify(data))
      }
    });
  }

  /**
   * 加入房间，房间已存在用户大于1，新加入的用户发送offer 
   * 
   * 发送者 createOffer => setLocalDescription => sendOffer
   * 
   * 接受者 setRemoteDescription => createAnswer => setLocalDescription => sendAnswer
   * 
   * 收到offer 给该房间内除自己以外的用户转发offer  「 sendId , offer 」
   * 收到answer 返回给发送offer的人     [ receiveId, answer]
   */

  offer (socket, message) {
    this.sendToUser(message.receiveId, {
      ...message,
      senderInfo: socket['userInfo']
    })
  }

  answer (socket, message) {
    this.sendToUser( message.receiveId, {
      ...message,
      senderInfo: socket['userInfo']
    })
  }

  icecandidate (socket, message) {
    this.sendToUser( message.receiveId, {
      ...message,
      senderInfo: socket['userInfo']
    })
  }

}