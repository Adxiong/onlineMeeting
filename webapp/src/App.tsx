/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-10 15:48:30
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-10 23:29:47
 */
import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import * as io from 'socket.io-client';
import './App.css'

const socket = io.connect('http://localhost:8000',{
  withCredentials: true,
  transports: ['websocket']
});


interface constraintsType {
  video: boolean,
  audio: boolean,
  echoCancellation: boolean
}

function App() {
  const VideoRef = React.createRef<HTMLVideoElement>()
  const [mediaTrack, setMediaTrack] = useState<MediaStreamTrack[]>()
  const constraints = {
    video: true,
    audio: true,
    echoCancellation: true
  }

  useEffect( () => {
    socket.on('connect', function() {
      console.log('ws connect.');
    });
    
    socket.on("message", (res) => {
      console.log(res);
    })
    socket.on('connect_error', function() {
        console.log('ws connect_error.');
    });
    
    socket.on('error', function(errorMessage) {
        console.log('ws error, ' + errorMessage);
    })}, [])

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
    <div className="App">
      <video ref={VideoRef} width={500} height={500} autoPlay></video>

      <Button onClick={handleClickOpenVideo}>打开摄像头</Button>
      <Button onClick={handleClickCloseAll} >关闭</Button>
      <Button onClick={handleClickAudioIcon}>关闭声音</Button>
    </div>
  )
}

export default App
