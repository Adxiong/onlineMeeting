/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-10 13:21:56
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-12 22:55:57
 */

import { Avatar } from 'antd'
import {FC, useEffect, useRef, useState} from 'react'
import { usePeerUser } from '../../hooks/peer'
import RTCPeer from '../../rtcPeer'
import Peer from '../../rtcPeer/peer'
import Style from './styles/Video.module.less'

export const PeerVideo = ({peer, rtcPeer}: {peer?: Peer, rtcPeer?: RTCPeer}) => {
  const [ userStream, setUserStream ] = useState<MediaStream>()
  
  const userRef = useRef<HTMLVideoElement>(null)
  const displayRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {    
    if (rtcPeer) {
      rtcPeer.on('localStream', (stream)  => {       
        setUserStream(stream)
      })
    }
    if (peer) {
      peer.on('remoteStream', (stream) => {
        console.log("remoteStream====>", stream);
        setUserStream(stream)
      })
    }
    if(userRef.current && userStream) {    
      console.log("userStream=====>", userStream );
        
      userRef.current.srcObject = userStream   
    }
    return () => {
      rtcPeer?.removeListener("localStream")
      peer?.removeListener("remoteStream")
    }
  }, [userStream, userRef])
  return (
    <div className={Style.videoComponents}>

      {
        userStream ? (
          <video ref={userRef} autoPlay controls width={200} height={200}></video>
        ) : (
          <Avatar size={200} >{peer?.nick || rtcPeer?.local.nick}</Avatar>
        )
      }
      <span className={Style.userTitle}>
        user:{peer?.nick || rtcPeer?.local.nick}
      </span>
     {/* {dispalyStream && (
        display:<video ref={displayRef} autoPlay></video>
     ): <h1>no display</h1>} */}

     
    </div>
  )
}
