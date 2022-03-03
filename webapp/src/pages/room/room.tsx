/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-16 17:17:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-03 14:42:07
 */


import { Button, message } from 'antd'
import { createRef, FC, useContext, useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Socket } from 'socket.io-client'
import Chat from '../../components/chat/chat'
import SocketClient from '../../socket'
import { StoreContext } from '../../store/store'
import Video from '../video/video'
import style from './styles/room.module.less'
import UserListComponent from '../../components/userList/userList'


/**
 * 
 * 消息格式
 * 
 * 
 */


/**
 * 
 * 1.进入房间，申请打开本地mediastream
 * 2.当房间用户大于2 createOffer addtrack本地视频流
 * 
 */

const Room: FC = () => {
  const params = useParams()
  const [searchParam, setSearchParam] = useSearchParams()
  const { store, dispatch } = useContext(StoreContext)
  const localVideoRef = useRef<HTMLVideoElement>( null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
  const [ localMediaStream, setLocalMediaStream ] = useState<MediaStream>()
  const [ localMediaStatus, setLocalMediaStatus ] = useState<boolean>(false)
  // const [ remoteMedia, setRemoteMedia ] = useState<MediaStreamTrack[]>([])
  // const [ peer, setPeer ] = useState<RTCPeerConnection>()


  
  const constraints = {
    video:  true,
    audio: true,
    // echoCancellation: true
  }
  
  useEffect( () => {
    const socket = new SocketClient({
      url: 'http://localhost:8000'
    })    
    let peer: RTCPeerConnection | null
    // initSocketEvent(socket)
    socket.on("message", async data => {
      const { type, payload} = JSON.parse(data)
      console.log(`type ===> ${type}`);
      
      switch (type) {
        case "roomInfo":
          dispatch({
            type: "setUserInfoList",
            payload: payload.roomUserList
          })
          peer = initPeerConnect(socket, payload.roomUserList) || null
          return 
        case "offer": 
          console.log("收到offer");
          
          if (peer) {
            console.log("存在peer");
            console.log(payload);
            
            peer.setRemoteDescription(payload)
            const answer =  await peer.createAnswer()
            console.log(answer);
            
            peer.setLocalDescription(answer)
            socket.send('message',{
              type:'answer',
              payload: answer
            })
          }
          return
        case "answer":
          peer?.setRemoteDescription(payload)
          return
        case "candidate" :
          peer?.addIceCandidate(new RTCIceCandidate(payload))
        case "level":
          message.info(payload.message)
      }
      
    })
    const nick = searchParam.get('nick') 
    const roomId = searchParam.get('roomId')
    if ( !nick || !roomId) {
      message.error('nick或者roomid为空！')
      return
    }
    socket.joinRoom({
      nick: nick,
      roomId: roomId
    })
  }, [])

  const initSocketEvent = (socket: SocketClient) => {

  }
  
  const initPeerConnect = (socket, peerList) => {    
    if (peerList.length > 1) {
      const peer = new RTCPeerConnection()
      const dc = peer.createDataChannel("my")

      peer.ontrack = (stream) => {
        remoteVideoRef.current &&  (remoteVideoRef.current.srcObject = stream.streams[0])
      }
      peer.onicecandidate = (e) => {
        if (e.candidate) {
          socket.send('message', {
            type: 'candidate',
            payload: e.candidate
          })
        }
      }
      peer.ondatachannel = (e) => {
        console.log(e.channel);
        e.channel.onmessage = (data) => {
          console.log(data);
          
        }
      }
      dc.addEventListener('open', () => {
        console.log("dc创建");

        dc.send(JSON.stringify({"message":'123'}))

      })

        //已经打开过 localMedaiStream 存在
        if ( localMediaStream ) {
          localMediaStream.getTracks().forEach( track => {
            peer.addTrack(track, localMediaStream)
          })

          peer.createOffer()
          .then ( offer => {
            console.log('存在视频流');
            
          })
          .catch ( err => {
            console.log(err);
             
          })
        } else {
          //本地视频没有打开
          navigator.mediaDevices.getUserMedia(constraints)
          .then( async stream => {
            setLocalMediaStream(stream)
            setLocalMediaStatus(true)
            localVideoRef.current && (localVideoRef.current.srcObject = stream)
            stream.getTracks().forEach( track => {
              peer.addTrack( track, stream)
            })
            const offer = await peer.createOffer()
            peer.setLocalDescription(offer)
            socket.send('message',{
              type: 'offer',
              payload: offer
            })
            
          } ) 
          .catch ( err => {
            console.log(err);
            
          })
        }
      return peer
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
          <video src="" ref={remoteVideoRef} autoPlay muted width={200} height={200}></video>
          {/* <Video media={remoteMedia}></Video> */}
        </div>
        <div>
          <Button>静音</Button>
          {/* <Button onClick={toogleLocalCamera}>
            {
              localMediaStatus ? "关闭摄像头" : "开启摄像头"
            }
          </Button> */}
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