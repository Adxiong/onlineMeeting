/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-16 17:17:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-23 21:33:15
 */


import { Button } from 'antd'
import { createRef, FC, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Socket } from 'socket.io-client'
import Chat from '../../components/chat/chat'
import SocketClient from '../../socket'
import { StoreContext } from '../../store/store'
import Video from '../video/video'
import style from './styles/room.module.less'


const Room: FC = () => {
  const params = useParams()
  const { store, dispatch } = useContext(StoreContext)
  const localVideoRef = createRef<HTMLVideoElement>()
  const [ media, setMedia ] = useState<MediaStreamTrack[]>([])
  const [ localMediaStatus, setLocalMediaStatus ] = useState<boolean>(false)
  const [ peer, setPeer ] = useState<RTCPeerConnection>()

  const registerPeerEvent = () => {

    if (peer) {    
      console.log("触发");
  
      peer.onicecandidate = (e) => {
        console.log(e);

        if (e.candidate) {
          store.client?.sendMessage({
            offer_ice :JSON.stringify({
            type: 'offer_ice',
            iceCandidate: e.candidate
          })})
        }
      }
      store.client?.on('message', e => {
        console.log("72行消息=====》",e);
        
        const { type, sdp, iceCandidate } = JSON.parse(e.data);
        if (type === 'offer_ice') {
          peer.addIceCandidate(iceCandidate);
        }
        if (type === 'offer') {
          navigator.mediaDevices.getUserMedia();		// 与发起方一致，省略
          const offerSdp = new RTCSessionDescription({ type, sdp });
          peer.setRemoteDescription(offerSdp).then(() => {
            peer.createAnswer(answer => {
                store.client?.sendMessage({"answer":JSON.stringify(answer)});
              peer.setLocalDescription(answer)
            });
          });
        }
      }
      )
      peer.ontrack = e => {
        if (e && e.streams) {
          localVideoRef.current!.srcObject = e.streams[0];
        }
      };
    }
  }
  
  useEffect( () => {
    const socket = new SocketClient({
      url: 'http://localhost:8000'
    })    
    setPeer(new RTCPeerConnection())
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

  
  useEffect( () => {
    //注册事件
    registerPeerEvent()
  },[])

  const constraints = {
    video:  true,
    audio: true,
    echoCancellation: true
  }

  
  const toogleLocalCamera = () => {
    if (!localMediaStatus) {
      // 为假时 打开摄像头
      navigator.mediaDevices.getUserMedia(constraints)
      .then( stream => {
        localVideoRef.current!.srcObject = stream
        localVideoRef.current!.style.transform = "rotateY(180deg)"
        setMedia(stream.getTracks())
        setLocalMediaStatus(true)
        if (peer) {
          stream.getTracks().forEach( track => {
            peer.addTrack(track, stream)
          })
          peer.createOffer()
          .then( offer => {
            peer.setLocalDescription(offer)            
            store.client && store.client.sendMessage({offer: JSON.stringify(offer)})
          })
        }
        
      })
    } else {
      // 为真时，关闭摄像头
      media.forEach(track => {
        track.stop()
      });
      setMedia([])
      setLocalMediaStatus(false)
      localVideoRef.current &&
      (localVideoRef.current.srcObject = null)
    }
    
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
          <Button onClick={toogleLocalCamera}>
            {
              localMediaStatus ? "关闭摄像头" : "开启摄像头"
            }
          </Button>
          <Button>屏幕共享</Button>
        </div>
        {params.roomId}
        </div>
      <Chat></Chat>
    </div>
 ) 
}

export default Room