import { message } from 'antd';
/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-03 15:24:29
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-06 21:02:49
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
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
  }

  receiveIceCandidate(candidate: RTCIceCandidate) {
    this.peerConnection.addIceCandidate(candidate)
  }

  replyAnswer(message: Message) {
    if (message.type === 'answer') {
      this.peerConnection.createAnswer()
      .then( (answer) => 
        this.peerConnection.setLocalDescription(answer)
      )
      .then( () => {
        const sendMessage = {
          type: "answer",
          receiveId: message.userInfo.id,
          payload: this.peerConnection.localDescription?.toJSON()
        }
        this.rtcPeerInstance.signalSend(sendMessage)
      })
      .catch( (error) => {
        throw new Error(`replayAnswer error ==> ${error} `)
      })
    }
  }

  initDataChannelEvents (dc: RTCDataChannel) {
    dc.onmessage = (event) => {
      console.log("dc-message ====>",event);
      
    }

    dc.close = () => {
      console.log("DC is close");
      
    }
  }




  initPeerEvents () {
    const pc = this.peerConnection

    pc.addEventListener('icecandidate', (event: RTCPeerConnectionIceEvent) => {
      if ( event.candidate) {
        //发送ice
        this.rtcPeerInstance.signalSend({
          type: "icecandidate",
          receiveId: this.id,
          payload: event.candidate
        })
      }
    })


    pc.addEventListener('track', (event: RTCTrackEvent ) => {
      const stream = event.streams[0]
      const sdp = event.target.remoteDescription.sdp.toString()
      const setUserStream = () => {
        if (!this.media.user || this.media.user.id != stream.id) {
          this.media.user = stream
          this.rtcPeerInstance.emit('stream:user', this)
        }  
      }
      const setDisplayStram = () => {
        if (!this.media.display || this.media.display.id != stream.id){
          this.media.display = stream
          this.rtcPeerInstance.emit('stream:dispaly', this)
        }
      }

      const streamType = this.detectTrackType(sdp, event.track)

      if (streamType === 'user') setUserStream()
      else if (streamType === 'display') setDisplayStram()

    })

    pc.addEventListener('negotiationneeded', () => {
      pc.createOffer()
      .then( offer => {
        offer.sdp = this.setTrackTagToSdp(offer.sdp, this.rtcPeerInstance.local.trackTag)
        return pc.setLocalDescription(offer).then( () => offer)
        }
      )
      .then( offer => {
        this.rtcPeerInstance.emit('negotiationneeded:done', this)
        this.rtcPeerInstance.signalSend({
          type: 'offer',
          receiveId: this.id,
          payload: offer
        })
      })
    })

    pc.addEventListener('datachannel', (event) => {
      const dc = event.channel
      this.dataChannel = dc
      this.isPeerConnected = true
      this.rtcPeerInstance.emit('join', this)
    })
  }


  setTrackTagToSdp(sdp: string = '', trackTag: string) {
    const sdpSplit = sdp.split('\n')
    for(let i = 0 ; i < sdpSplit.length ; i++) {
      sdpSplit[i] = sdpSplit[i].replace('/(a=extmap:[0-9]+) [^ \n]+/ig', `$1 ${trackTag}`)
    }
    return sdpSplit.join('\n')
  }

  detectTrackType(sdp: string, track: MediaStreamTrack) {
    if (sdp.indexOf(`[user/${track.id}]`) !== -1) {
      return 'user'
    }
    else if (sdp.indexOf(`[display/${track.id}]`) !== -1){
      return 'display'
    }
  }

  addTrack (track: MediaStreamTrack, ...streams: MediaStream[]) {
    this.peerConnection.addTrack(track, ...streams)
  }

  peerSend (message: string) {
    this.dataChannel?.send(message)
  }
  close() {
    
  }
}