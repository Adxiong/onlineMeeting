/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-03 15:13:58
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-06 20:31:58
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
  join: {roomId: string, nick: string}
}

export type Message  = {
  [k in keyof payloadMap]: {
    type: string,
    receiveId: string | null,
    payload: payloadMap[k]
  }
}[keyof payloadMap]

export interface JoinParam {
  roomId: string,
  nick: string
}

