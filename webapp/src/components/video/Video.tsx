/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-10 13:21:56
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-15 15:58:06
 */

import { Avatar } from 'antd'
import {FC, useEffect, useRef, useState} from 'react'
import { usePeerUser } from '../../hooks/peer'
import RTCPeer from '../../rtcPeer'
import Peer from '../../rtcPeer/peer'
import Style from './styles/Video.module.less'

export const PeerVideo = ({peer, rtcPeer}: {peer?: Peer, rtcPeer?: RTCPeer}) => {
  const [ userStream, setUserStream ] = useState<MediaStream>()
  const [ displayStream, setDisplayStream ] = useState<MediaStream>()
  
  const userRef = useRef<HTMLVideoElement>(null)
  const displayRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {    
    if (rtcPeer) {
      rtcPeer.on('localStream', (stream,type)  => {
        if (type == 'user') {
          setUserStream(stream)
        } else {
          setDisplayStream(stream)
        }
      })
    }
    if (peer) {
      peer.on('remoteStream', (stream,type) => {
        if( type == 'user') {
          setUserStream(stream)
        } else {
          setDisplayStream(stream)
        }
      })
    }
    if(userRef.current && userStream) {            
      userRef.current.srcObject = userStream   
    }
    if (displayRef.current && displayStream) {
      displayRef.current.srcObject = displayStream
    }
    return () => {
      rtcPeer?.removeListener("localStream")
      peer?.removeListener("remoteStream")
    }
  }, [userStream, userRef, displayStream, displayRef])
  return (
    <div className={Style.videoComponents}>

      {
        
        userStream &&  (
          <video ref={userRef} autoPlay muted controls width={200} height={200}></video>
        ) 
      }
      {
         displayStream && (
          <video ref={displayRef} autoPlay controls width={200} height={200}></video>
        )
      }
      {
        !userStream && !displayStream  && (
          <Avatar size={200} >{peer?.nick || rtcPeer?.local.nick}</Avatar>
        )
      }
      <span className={Style.userTitle}>
        user:{peer?.nick || rtcPeer?.local.nick}
      </span>
     

     
    </div>
  )
}
