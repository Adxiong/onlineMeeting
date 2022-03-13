/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-16 17:25:24
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-13 17:24:59
 */

import { Input } from 'antd'
import { FC, useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../store/store'
import styles from './styles/chat.module.less'
import Message from './message'
import RTCPeer from '../../rtcPeer'

const Chat = ({peer}: {peer: RTCPeer}) => {
  const [message, setMessage] = useState<any[]>([])
  useEffect( () => {
    peer.on('message:dc', (data: string) => {         
      console.log(data);
               
      setMessage((message) => {
        return [
          ...message,
          JSON.parse(data)
        ]
      })
    })
  }, [peer])

  const sendMessage = (value: string) => {
    peer.send(value)
    setMessage( (state) => {
      console.log(value);
      
      return [
        ...state,
        {
          type: 'group',
          send: 'adxiong',
          content: value,
          date: new Date().toString()
        }
      ]
    })
  }

  const inputPressEnter = (e: {target: {value: string}}) => {
    console.log(e.target.value);
    const value = e.target.value
    if( !value ) {
      return
    } 
    sendMessage(value)
    e.target.value = ''
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
          autoFocus
          style={{resize: 'none'}}
          rows={4} 
          bordered={false} 
          onPressEnter={inputPressEnter}></Input.TextArea>
      </div>
    </div>
  )
}

export default Chat