/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-16 17:17:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-27 20:31:25
 */


import { Button } from 'antd'
import { createRef, FC, useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Socket } from 'socket.io-client'
import Chat from '../../components/chat/chat'
import SocketClient from '../../socket'
import { StoreContext } from '../../store/store'
import Video from '../video/video'
import style from './styles/room.module.less'



/**
 * 
 * 1.进入房间，申请打开本地mediastream
 * 2.当房间用户大于2 createOffer addtrack本地视频流
 * 
 */

const Room: FC = () => {
  const params = useParams()
  const [ peerList, setPeerList ] = useState<RTCPeerConnection[]>([])
  const { store, dispatch } = useContext(StoreContext)
  const localVideoRef = useRef<HTMLVideoElement>( null)
  // const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
  const [ localMediaStream, setLocalMediaStream ] = useState<MediaStream>()
  const [ localMediaStatus, setLocalMediaStatus ] = useState<boolean>(false)
  // const [ remoteMedia, setRemoteMedia ] = useState<MediaStreamTrack[]>([])
  // const [ peer, setPeer ] = useState<RTCPeerConnection>()

  // const registerPeerEvent = (socket, peer, userInfo) => {
    
  //   if (peer && socket) {    
      
  //     peer.onicecandidate = (e) => {
  //       console.log("触发ice",userInfo);
  //       if (e.candidate) {
  //         socket.send('addIceCandidate', {user: userInfo.name, candidate: e.candidate})
  //       }
  //     }
  //     socket.on('addIceCandidate', data => {
  //       const { candidate, user} = JSON.parse(data)
  //       peer.addIceCandidate(candidate)
  //     })

  //     socket.on('receiveAnswer', (answer) => {
  //       // const { answer } = JSON.parse(data)
  //       peer.setRemoteDescription(answer)
  //     })
  //     socket.on('receiveOffer', async (data) => {
  //       console.log("触发", JSON.parse(data));

  //       // const stream = await navigator.mediaDevices.getUserMedia(constraints)
  //       // localVideoRef.current && (localVideoRef.current.srcObject = stream)
  //       // stream.getTracks().forEach(track => {
  //       //   peer.addTrack(track, stream)
  //       // });

  //       const { offer, user } = JSON.parse(data)
  //       await peer.setRemoteDescription(offer)
  //       const answer = await peer.createAnswer()
  //       socket.send( 'receiveAnswer', {answer, user: userInfo.name})
  //       peer.setLocalDescription(answer)
  //     })
    
  //     peer.ontrack = e => {        
  //       console.log(`trackEvent ===>`, e);
              
  //       if (e && e.streams && remoteVideoRef.current) {
  //         console.log("视频流绑定", e.track);
  //         remoteVideoRef.current!.srcObject = e.streams[0]
  //       }
  //     };
  //   }
  // }
  
  const constraints = {
    video:  true,
    audio: true,
    // echoCancellation: true
  }

  useEffect( () => {
    const socket = new SocketClient({
      url: 'http://localhost:8000'
    })    

    //加入房间连接socket
    //peerList 大于1  createOffer

    if (peerList.length > 1) {
      const peer = new RTCPeerConnection()
      // if(!localMediaStatus) {
        //本地视频没有打开
        navigator.mediaDevices.getUserMedia(constraints)
        .then( stream => {

          setLocalMediaStream(stream)
          setLocalMediaStatus(true)
          console.log(localVideoRef);
          
          localVideoRef.current && (localVideoRef.current.srcObject = stream)
          stream.getTracks().forEach( track => {
            peer.addTrack( track, stream)
          })
          setPeerList(  peerList => {
            return [ ...peerList, peer]
          })
        } ) 
        .catch ( err => {
          console.log(err);
          
        })
      // } else {
      //   setLocalMediaStatus(false)
      // }
    }

    // const peer = new RTCPeerConnection()
    
    // const userInfo = JSON.parse(String(window.localStorage.getItem("userInfo")))
    // if (!store.name && !store.roomId && userInfo) {
    //   dispatch({
    //     type: 'setUserInfo',
    //     payload: {
    //       name: userInfo.name,
    //       roomId: userInfo.roomId
    //     } 
    //   })
    //   socket.joinRoom({
    //     name: userInfo?.name || store.name,
    //     roomId: userInfo?.roomId || store.roomId
    //   })
    //   dispatch({
    //     type: "setSocket",
    //     payload: socket
    //   })
    // }
    
    // registerPeerEvent(socket, peer, userInfo)
    
    // setPeer(() => {
    //   return peer
    // })
  }, [])

  

  
  // const toogleLocalCamera = () => {
  //   console.log("打开摄像头",store);
    
  //   if (!localMediaStatus) {
  //     // 为假时 打开摄像头
  //     navigator.mediaDevices.getUserMedia(constraints)
  //     .then( stream => {
  //       localVideoRef.current!.srcObject = stream
  //       localVideoRef.current!.style.transform = "rotateY(180deg)"
  //       // setMedia(stream.getTracks())
  //       stream.getTracks().forEach( track => {
  //         peer?.addTrack(track, stream)
  //       })
  //       setLocalMediaStatus(true)
  //       if (peer) {          
  //         peer.createOffer()
  //         .then( offer => {
  //           peer.setLocalDescription(offer)            
  //           store.client && store.client.send('receiveOffer', {user: store.name , offer})
  //         })
  //       }
        
  //     })
  //   } else {
  //     // 为真时，关闭摄像头
  //     media.forEach(track => {
  //       track.stop()
  //     });
  //     setMedia([])
  //     setLocalMediaStatus(false)
  //     localVideoRef.current &&
  //     (localVideoRef.current.srcObject = null)
  //   }
    
  // }

  
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
          {/* <video src="" ref={remoteVideoRef} autoPlay muted width={200} height={200}></video> */}
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
      <Chat></Chat>
    </div>
 ) 
}

export default Room