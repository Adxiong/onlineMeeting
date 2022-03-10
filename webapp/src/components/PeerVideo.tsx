/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-10 13:21:56
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-10 23:44:12
 */

import {FC, useEffect, useRef} from 'react'
import { usePeerUser } from '../hooks/peer'
import RTCPeer from '../rtcPeer'
import Peer from '../rtcPeer/peer'


export const PeerVideo = ({peer}: {peer: Peer}) => {
  const userStream = usePeerUser(peer)
  const userRef = useRef<HTMLVideoElement>(null)
  const displayRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    console.log('userstream====>',userStream);
    
    if(userRef.current && userStream) {
      console.log(userRef.current);
      
      userRef.current.srcObject = userStream
    }
  }, [userStream, userRef])
  return (
    <div>
      user:{peer.id}<video ref={userRef} autoPlay width={200} height={200}></video>
     {/* {dispalyStream && (
        display:<video ref={displayRef} autoPlay></video>
     ): <h1>no display</h1>} */}

     
    </div>
  )
}
