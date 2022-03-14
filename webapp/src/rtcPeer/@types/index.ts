/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-03 15:13:58
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-14 17:31:20
 */

import Peer from "../peer";


export interface PeerInfo {
  id: string,
  nick: string
}

export interface Media {
  display?: MediaStream,
  user?: MediaStream
}

export interface Local {
  id: string,
  nick: string,
  roomId: string,
  trackTag: string,
  peers: Peer[],
  media: Media
}

interface payloadMap {
  join: {
    roomId: string,
    nick: string
  }

  roomInfo: {
    userInfo: PeerInfo
    users: PeerInfo[]
  }
  
  offer: RTCSessionDescriptionInit
  answer: RTCSessionDescriptionInit
  icecandidate: RTCIceCandidateInit
  level: PeerInfo
  
}

export interface DcMessage {
  [propName: string]: any
  sendId: string,
  sendNick: string,
  content: string,
  sendTime: string
}

export type Message  = {
  [k in keyof payloadMap]: {
    type: string,
    receiveId: string | null,
    payload: payloadMap[k],
    userInfo?: {
      id: string,
      nick: string
    }
  }
}[keyof payloadMap]

export interface JoinParam {
  roomId: string,
  nick: string
}

