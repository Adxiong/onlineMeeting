/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-11 16:57:07
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-11 16:58:21
 */

import { Button } from 'antd'
import React, { useState } from 'react'
import { FC } from 'react'


interface constraintsType {
  video: boolean,
  audio: boolean,
  echoCancellation: boolean
}

const Video:FC = () => {
  const VideoRef = React.createRef<HTMLVideoElement>()
  const [mediaTrack, setMediaTrack] = useState<MediaStreamTrack[]>()
  const constraints = {
    video: true,
    audio: true,
    echoCancellation: true
  }
  

  function handleClickOpenVideo () {
    openMediaDevice(constraints)
  }


  function handleClickAudioIcon () {    
    VideoRef.current && (VideoRef.current.muted = !VideoRef.current.muted)
  }

  function handleClickCloseAll() {
    
    mediaTrack && (
      mediaTrack.forEach( track => {
        track.stop()
        VideoRef.current && (VideoRef.current.srcObject = null)
      })
    )
  }

  function openMediaDevice (constraints: constraintsType) {
    navigator.mediaDevices.getUserMedia(constraints)
    .then( (stream) => {
      if (VideoRef.current) {
        VideoRef.current.srcObject = stream
        setMediaTrack(stream.getTracks())
      }
    })
    .catch (err => {
      console.log(err);
    })
  }
  
  return (
    <div>
      <video ref={VideoRef} width={500} height={500} autoPlay></video>

      <Button onClick={handleClickOpenVideo}>打开摄像头</Button>
      <Button onClick={handleClickCloseAll} >关闭</Button>
      <Button onClick={handleClickAudioIcon}>关闭声音</Button>
    </div>
  )
}

export default Video