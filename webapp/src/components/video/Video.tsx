/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-10 13:21:56
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-11 17:24:10
 */

import { Avatar } from 'antd'
import {FC, useEffect, useRef} from 'react'
import { usePeerUser } from '../../hooks/peer'
import RTCPeer from '../../rtcPeer'
import Peer from '../../rtcPeer/peer'
import Style from './styles/Video.module.less'

export const PeerVideo = ({peer}: {peer: Peer}) => {
  const userStream = usePeerUser(peer)
  const userRef = useRef<HTMLVideoElement>(null)
  const displayRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    console.log('userstream====>',userStream, peer,);
    
    if(userRef.current && userStream) {      
      userRef.current.srcObject = userStream
    }
  }, [userStream, userRef])
  return (
    <div className={Style.videoComponents}>
      {
        userStream ? (
          <video ref={userRef} autoPlay width={200} height={200}></video>
        ) : (
          <Avatar>{peer.nick}</Avatar>
        )
      }
      <div>
        user:{peer.nick}-{peer.id}
      </div>
     {/* {dispalyStream && (
        display:<video ref={displayRef} autoPlay></video>
     ): <h1>no display</h1>} */}

     
    </div>
  )
}
