/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-14 17:03:21
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-28 17:34:46
 */


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
      this.socket['client'] = socket
      socket.on('joinRoom', (data) => this.joinRoom(socket, data))
    }) 
  }
 



  joinRoom(socket: io.Socket, context) {
    //给其他人推送，xx已经加入房间
    // console.log(socket, context);
    const data = JSON.parse(context)    
    const userInfo = {
      id: socket['userInfo'].id,
      nick: data.userInfo.nick,
      roomId: data.userInfo.roomId
    }
    logger.info(`id=${userInfo.id} 的 ===》 ${userInfo.nick} 加入房间 ${userInfo.roomId}`)

    socket['userInfo'] = userInfo

    const roomUserList = this.getRoomUserList(userInfo.id, userInfo.roomId)

    socket.send(JSON.stringify(
      {
        type: "roomInfo",
        payload: {
          roomUserList: roomUserList,
          userInfo: userInfo
        }
      } 
    ))
  }

  getRoomUserList (id, roomId) {
    return Array.from(this.socket['client'])
    .map( client => client['userInfo'])
    .filter( userInfo => userInfo.roomId == roomId && userInfo.id != id)
  }
}