import RTCPeer  from '.';
import { message } from 'antd';
/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-14 16:37:17
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-07 15:13:44
 */
import * as io from 'socket.io-client';
import { Message } from './@types';
import Peer from './peer';


export default class SocketClient {
  url: string = 'http://localhost:8000'
  socket: io.Socket | null = null
  peer: RTCPeer
  constructor(signalServer: string, rtcPeer: RTCPeer) {    
    this.url = signalServer
    this.peer = rtcPeer
    this.connect()
  }
  
  connect () {
    //存在socket 便不用重新连接
    if (this.socket) return
    this.socket = io.connect(this.url, {
      withCredentials: true,
      transports: ['websocket'],
    })

    this.socket.on("connect", () => {
      this.socket?.on("message", (message) => {
        this.handle(message)
      })
    })
  }


  roomInfo(message: Message) {

    if(message.type === 'roomInfo') {
      const {user, userInfo} = message.payload
      this.peer.local.id = user.id
      this.peer.local.nick = user.nick
      userInfo.forEach( peerInfo => {
        this.peer.connectPeer(peerInfo)
      });
      this.peer.emit('roomInfo', message)
    }
  }

  offer(message: Message){
    /**
     * 收到offer  message里有userinfo。根据userInfo查找peer 没有查到就创建rtc -> add -> connect
     * 找到直接用peer.replyanswer（）
     */
    if(message.userInfo && message.type === 'offer') {
      const { id, nick } = message.userInfo
      let peer = this.peer.findPeer(id)
      if( !peer ) {
        peer = new Peer(
          id,
          nick,
          this.peer.peerConfig ,
          this.peer
        )
        this.peer.addPeer(peer)
        this.peer.pushLocalStream(peer)
        
      }
  
      peer.receiveOffer(message)
    }
   
  }

  answer(message: Message){
    if(message.userInfo && message.type === 'answer'){
      const {id, nick} = message.userInfo
      const peer = this.peer.findPeer(id)
      peer?.replyAnswer(message)
    }
  }

  icecandidate(message: Message){
    if(message.userInfo && message.type === 'icecandidate') {
      const {id, nick} = message.userInfo
      const peer = this.peer.findPeer(id)
      peer?.receiveIceCandidate(new RTCIceCandidate(message.payload))
    }
  }

  join(message: Message) {

  } 

  level(message: Message){
    if(message.type === 'level' && message.userInfo){
      const {id, nick} = message.userInfo
      const peer = this.peer.findPeer(id)
      if( peer) {
        peer.close()
        this.peer.local.peers = this.peer.local.peers.filter( p => p.id != id)
      }

      this.peer.emit("level",message)

    }
  }

  handle(data: string) {
    const message: Message = JSON.parse(data) 
    this[ message.type.toString()](message)
  }

  sendMessage(chatInfo: {[propName: string]: string}) {
    this.socket && this.socket.emit('message',JSON.stringify(chatInfo))
  }

  send(data: string) {
    this.socket && this.socket.send(data)
  }

  close(){
    console.log('断开操作');
    this.socket?.close()
  }
}