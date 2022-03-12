/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-16 17:17:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-12 22:36:09
 */


import { Avatar, Button, Divider, message } from 'antd'
import {  FC, useContext, useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Chat from '../../components/chat/chat'
import { StoreContext } from '../../store/store'
import style from './styles/room.module.less'
import RTCPeer from '../../rtcPeer'
import { Local } from '../../rtcPeer/@types'
import { PeerVideo } from '../../components/video/Video'
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
      console.log(peer);
      
    })
    peer.on("addPeer", (peers) => {
      setPeers([...peers])
    })

    peer.on("level",(peers) => {      
      setPeers([...peers])
    })
    peer.join({roomId,nick})
    setPeer(()=>peer)
  }, [])

  
  const openCamera = async() => {
    if ( peer) {
      await peer.shareUser({video: true, audio: true})         
    }
  }



  
  return (
    <div className={style.roomPanel}>
      <div className={style.videoArea}>
        <div className={style.userList}> 
        
        
        
          <div>
            <PeerVideo key={peer?.local.id} rtcPeer={peer}></PeerVideo>
            <Button>静音</Button>
            {/* <Button onClick={toogleLocalCamera}>
              {
                localMediaStatus ? "关闭摄像头" : "开启摄像头"
              }
            </Button> */}
            <Button onClick={openCamera}>打开摄像头</Button>
            <Button>屏幕共享</Button>
          </div>
        
          {  
            peers.map( peer => {                
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
      <Chat></Chat>
    
    </div>
 ) 
}

export default Room