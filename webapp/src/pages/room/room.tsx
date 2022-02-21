/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-16 17:17:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-21 22:19:18
 */


import { Button } from 'antd'
import { createRef, FC, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Chat from '../../components/chat/chat'
import SocketClient from '../../socket'
import { StoreContext } from '../../store/store'
import Video from '../video/video'
import style from './styles/room.module.less'


const Room: FC = () => {
  const params = useParams()
  const { store, dispatch } = useContext(StoreContext)
  const localVideoRef = createRef<HTMLVideoElement>()
  useEffect( () => {
    const socket = new SocketClient({
      url: 'http://localhost:8000'
    })    
    const userInfo = JSON.parse(String(window.localStorage.getItem("userInfo")))
    if (!store.name && !store.roomId && userInfo) {
      dispatch({
        type: 'setUserInfo',
        payload: {
          name: userInfo.name,
          roomId: userInfo.roomId
        } 
      })
      socket.joinRoom({
        name: userInfo?.name || store.name,
        roomId: userInfo?.roomId || store.roomId
      })
      dispatch({
        type: "setSocket",
        payload: socket
      })
    }
  }, [])

  const constraints = {
    video:  true,
    audio: true,
    echoCancellation: true
  }

  const startLocalCamera = () => {

    navigator.mediaDevices.getUserMedia(constraints)
    .then( stream => {
      localVideoRef.current!.srcObject = stream
      localVideoRef.current!.style.transform = "rotateY(180deg)"
    })
  }
  return (
    <div className={style.roomPanel}>
      <div className={style.videoArea}>
        <div className={style.personVideo}>
          <div className={style.videoEle}>
            <video src="" ref={localVideoRef} autoPlay muted></video>
          </div>
          <div className={style.personName}>
            <span></span>
          </div>
        </div>
        <div>
          <Button>静音</Button>
          <Button onClick={startLocalCamera}>打开视频</Button>
          <Button>屏幕共享</Button>
        </div>
        {params.roomId}
        </div>
      <Chat></Chat>
    </div>
 ) 
}

export default Room