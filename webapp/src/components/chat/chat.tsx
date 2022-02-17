/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-16 17:25:24
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-17 14:56:46
 */

import { Input } from 'antd'
import { FC, useEffect, useState } from 'react'
import { useSocketContext } from '../../hooks/useSocket'
import styles from './styles/chat.module.less'

const Chat: FC = () => {
  const { socketState } = useSocketContext()
  const [message, setMessage] = useState<any[]>([])

  useEffect( () => {
    socketState.client.on('message', (data: string) => {      
      setMessage((message) => {
        return [
          ...message,
          JSON.parse(data)
        ]
      })
    })
  }, [])

  const sendMessage = (message: string) => {
    socketState.client.sendMessage({
      send: socketState.client.nickname,
      message
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
          {
            message.map( (item, index) => {              
              return (
                <div key={index}>
                  {item.message}
                </div>
              )
            })
          }
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