import { JoinParam, Message } from './@types/index';
/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-03 14:52:39
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-03 18:10:26
 */
import SocketClient from "../socket";
import { Local } from './@types/index';
import { trace } from 'console';


export interface PeerInit {
  signalServer: string,
  peerConfig?: RTCConfiguration
}
export default class RTCPeer {
  signalServer: string
  peerConfig: RTCConfiguration
  local: Local
  ws?: SocketClient

  constructor ( {
    signalServer,
    peerConfig
  }: PeerInit
  ) {
    this.signalServer = signalServer,
    this.peerConfig = peerConfig || {}
    this.local = {
      id: "",
      nick: "",
      roomId: "",
      peers: [],
      media: {}
    }
  }

  initSocketClient () {
    this.ws = new SocketClient(this.signalServer)
  }

  async join({roomId, nick}: JoinParam) {
    if( !this.ws ) {
      await this.initSocketClient
    } 
    const { local } = this

    if(nick) local.nick = nick

    const message: Message = {
      type: "join",
      receiveId: null,
      payload: {
        roomId,
        nick
      }
    }

    this.signalSend(message)
  }

  signalSend(message: Message) {
    if (this.ws) {
      this.ws?.send(JSON.stringify(message))
    } else {
      throw new Error("ws is not defined")
    }
  }

  level () {    
    this.local.media.user?.getTracks().forEach( track => track.stop())
    this.local.media.display?.getTracks().forEach( track => track.stop())
    delete this.local.media.user
    delete this.local.media.display
    this.local.peers.forEach( peer => {
      
    })
    this.local.peers = []
    this.ws?.close()
    delete this.ws
  }
  
}