/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-16 17:25:24
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-14 21:50:38
 */

import { Input } from 'antd'
import { FC, useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../store/store'
import styles from './styles/chat.module.less'
import Message from './message'
import RTCPeer from '../../rtcPeer'
import { DcMessage } from '../../rtcPeer/@types'

const Chat = ({peer}: {peer: RTCPeer}) => {
  const [message, setMessage] = useState<DcMessage[]>([])
  const [textValue, setTextValue] = useState<string>("")
  useEffect( () => {
    peer.on('message:dc', (data: DcMessage) => {     
      setMessage((message) => {
        return [
          ...message,
          data
        ]
      })
    })
  }, [peer])

  const sendMessage = (value: string) => {
    const messageData: DcMessage = {
      sendId: peer.local.id,
      sendNick: peer.local.nick,
      content: value,
      sendTime: new Date().getTime().toString()
    }
    peer.send(messageData)
    setMessage( (message) => {
      return [
        ...message,
        messageData
      ]
    })
  }

  const inputPressEnter = (e) => {
    sendMessage(textValue)
    setTextValue("")
  }

  const inputChange = (e) => {
    setTextValue(e.target.value)
  }

  return (
    <div className={styles.chatPanel}>
      <div className={styles.messageBox}>
          <Message
            message={message}
          ></Message>
      </div>
      <div className={styles.messageInputPanel}>
        <div className={styles.toolbar}>
          <span>😊</span>
        </div>
        <Input.TextArea   
          value={textValue}
          autoFocus
          style={{resize: 'none'}}
          rows={4} 
          bordered={false} 
          onChange={inputChange}
          onPressEnter={inputPressEnter}></Input.TextArea>
      </div>
    </div>
  )
}

export default Chat