import { JoinParam, Message, PeerInfo } from './@types/index';
/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-03 14:52:39
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-05 17:59:41
 */
import SocketClient from "../socket";
import { Local } from './@types/index';
import { trace } from 'console';
import Peer from './peer';
import * as EventEmitter from 'eventemitter3'


export interface PeerInit {
  signalServer: string,
  peerConfig?: RTCConfiguration
}
export default class RTCPeer {
  signalServer: string
  peerConfig: RTCConfiguration
  local: Local
  ws?: SocketClient
  private eventBus: EventEmitter = new EventEmitter()

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
  
  connectPeer (peerInfo: PeerInfo) {
    const peer = new Peer(
      peerInfo.id,
      peerInfo.nick,
      this.peerConfig,
      this
    )
    this.addPeer(peer)
    peer.connect()
  }
  addPeer (peer: Peer) {
    this.local.peers.push(peer)
  }

  findPeer (id: string) {
    return this.local.peers.find( peer => peer.id == id)
  }

  shareUser (constraints: MediaStreamConstraints = {
    video: true,
    audio: true
  }) {
    const { local } = this
    navigator.mediaDevices.getUserMedia()
    .then( stream => {
      local.media.user = stream
      this.local.peers.forEach( peer => {
        stream.getTracks().forEach( track => {
          peer.addTrack(track, stream)
        }) 
      })
    })
    .catch( err => {
      throw new Error(err)
    })
  }

  shareDisplay (constraints: DisplayMediaStreamConstraints) {
    const { local } = this
    navigator.mediaDevices.getDisplayMedia(constraints)
    .then( stream => {
      this.local.media.display = stream
      this.local.peers.forEach( peer => {
        stream.getTracks().forEach( track => {
          peer.addTrack(track, stream)
        })
      })
    })
    .catch( err => {
      throw new Error(err)
    })
  }

  pushLocalStream (peer: Peer) {
    const {user, display} = this.local.media
    if(user){
      user.getTracks().forEach( track => {
        peer.addTrack(track, user)
      })
    }
    if (display) {
      display.getTracks().forEach( track => {
        peer.addTrack(track, display)
      })
    }
  }

  on(event: string | symbol, fn: (...args: any[]) => void, context?: any) {
    this.eventBus.on(event, fn, context)
  }

  emit(event: string | symbol, ...args: any[]) {
    this.eventBus.emit(event, ...args)
  }

  removeListener (event: string | symbol, fn?: ((...args: any[]) => void) | undefined, context?: any, once?: boolean | undefined) {
    this.eventBus.removeListener(event, fn, context, once)
  }
}