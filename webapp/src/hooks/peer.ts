import { useState, useEffect } from 'react';
import RTCPeer from '../rtcPeer';
/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-10 13:15:05
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-10 23:31:57
 */

import Peer from "../rtcPeer/peer";


export const usePeerUser = (peer: Peer ) => {
  console.log('userPeerUser===>',{peer})
  const [stream, setStream] = useState<MediaStream>()
  useEffect(() => {
    peer && peer.on('userTrack', (data) => {
      console.log("触发userTrack====>",data);
      
        setStream(peer.media.user as MediaStream)
    })
  }, [peer])

  return stream
}