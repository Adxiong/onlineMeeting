/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-03 15:24:29
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-05 18:00:58
 */

import RTCPeer from "."
import { Media, Message } from "./@types"

export default class Peer {
  id: string
  public media: Media = {}
  private peerConnection: RTCPeerConnection
  private rtcPeerInstance: RTCPeer
  private isPeerConnected: boolean = false
  private dataChannel?: RTCDataChannel
  constructor (
    id: string,
    nick: string,
    peerconfig: RTCConfiguration,
    rtcPeerInstance: RTCPeer) {
    this.id = ""
    this.peerConnection = new RTCPeerConnection(peerconfig)
    this.rtcPeerInstance = rtcPeerInstance
  }

  connect() {
    if (this.isPeerConnected) {
      return Promise.reject("peer is already connected")
    } 

    const {peerConnection} = this
    return new Promise( (resolve , reject) => {
      const dc = peerConnection.createDataChannel("DC")

      dc.addEventListener('open', () => {
        this.dataChannel = dc
        this.isPeerConnected = true
        this.initDataChannelEvents(dc)
        //发送连接事件
        this.rtcPeerInstance.emit('connect', this)
        this.rtcPeerInstance.ws
        resolve("连接成功")
      })

      setTimeout(() => {
        reject( new Error("连接超时"))
      }, 10*1000);
    })
  }

  receiveOffer (message: Message) {
    if (message.type === 'offer') {
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.payload))
      .then( () => this.replyAnswer(message))
    }
  }

  receiveAnswer(answer: RTCSessionDescription) {
    this.peerConnection.setRemoteDescription(answer)
  }

  replyAnswer(message: Message) {


    
  }

  initPeerEvents () {
    const pc = this.peerConnection
    pc.addEventListener('track', (event: RTCTrackEvent ) => {
      const stream = event.streams[0]

      const setUserStream = () => {
        if (!this.media.user || this.media.user.id != stream.id) {
          this.media.user = stream
  
        }  
      }
      const setDisplayStram = () => {
        if (!this.media.display || this.media.display.id != stream.id){
          this.media.display = stream
        }
      }


    })

    pc.addEventListener('icecandidate', (event: RTCPeerConnectionIceEvent) => {
      if ( event.cancelable) {
        //发送ice
      }
    })
  }

  initDataChannelEvents (dc: RTCDataChannel) {
    dc.onmessage = (event) => {
      console.log("dc-message ====>",event);
      
    }

    dc.close = () => {
      console.log("DC is close");
      
    }
  }



  addTrack (track: MediaStreamTrack, ...streams: MediaStream[]) {
    this.peerConnection.addTrack(track, ...streams)
  }

}