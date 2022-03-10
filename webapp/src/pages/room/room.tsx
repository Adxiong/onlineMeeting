/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-16 17:17:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-11 00:26:35
 */


import { Button, message } from 'antd'
import { createRef, FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Socket } from 'socket.io-client'
import Chat from '../../components/chat/chat'
import SocketClient from '../../rtcPeer/socket'
import { StoreContext } from '../../store/store'
import Video from '../video/video'
import style from './styles/room.module.less'
import UserListComponent from '../../components/userList/userList'
import RTCPeer from '../../rtcPeer'
import util from '../../utils/util'
import { Local, PeerInfo } from '../../rtcPeer/@types'
import { url } from 'inspector'
import { usePeerUser } from '../../hooks/peer'
import { PeerVideo } from '../../components/PeerVideo'
import Peer from '../../rtcPeer/peer'

const Room: FC = () => {
  const params = useParams()
  const [searchParam, setSearchParam] = useSearchParams()
  const { store, dispatch } = useContext(StoreContext)
  const localVideoRef = useRef<HTMLVideoElement>( null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
  const [ peer, setPeer ] = useState<RTCPeer>()
  const [peers, setPeers] = useState<Peer[]>([])
  const constraints = {
    video:  true,
    audio: true,
    // echoCancellation: true
  }
  
  useEffect( () => {
    const peer = new RTCPeer({signalServer:"http://localhost:8000", peerConfig:{}})
    
    const nick = searchParam.get('nick') 
    const roomId = searchParam.get('roomId')
    if ( !nick || !roomId) {
      message.error('nick或者roomid为空！')
      return
    }
    peer.on('connected', (peer) => {
      setPeers([...peers, peer])

    })
    peer.on('roomInfo', (roomInfo) => {
      console.log("roomIno===>",roomInfo);
      dispatch({
        type: "setUserInfoList",
        payload: roomInfo
      })
      // setPeers()
    })
    peer.on('joinRoom', (peer) => {
      setPeers([...peers, peer])
    })
    peer.join({roomId,nick})
    setPeer(()=>peer)
  }, [])
  
  const openCamera = async() => {
    if ( peer && localVideoRef.current ) {
      const local: Local = await peer.shareUser({video: true, audio: true})
      localVideoRef.current.srcObject = local.media.user!
    }
  }



  
  return (
    <div className={style.roomPanel}>
      <div className={style.videoArea}>
        <div className={style.personVideo}>
          <div className={style.videoEle}>
            <video src="" ref={localVideoRef} autoPlay muted width={200} height={200}></video>
          </div>
          <div className={style.personName}>
            <span></span>
          </div>          
          <div>
         { 
            
            
            peer?.local.peers.map( peer => {                
                return (
                  
                  <PeerVideo key={peer.id} peer={peer} />
                  // <div key={peer.id}>
                  //   {peer.id}
                  //   <video src="" id={peer.id}  autoPlay muted width={200} height={200}></video>
                  // </div>
                )
              })
            }
          </div>
        </div>
        <div>
          <Button>静音</Button>
          {/* <Button onClick={toogleLocalCamera}>
            {
              localMediaStatus ? "关闭摄像头" : "开启摄像头"
            }
          </Button> */}
          <Button onClick={openCamera}>打开摄像头</Button>
          <Button>屏幕共享</Button>
        </div>
        {params.roomId}
        </div>
        <UserListComponent/>
      <Chat></Chat>
    </div>
 ) 
}

export default Room