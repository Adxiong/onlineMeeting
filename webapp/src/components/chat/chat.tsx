/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-16 17:25:24
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-19 00:39:15
 */

import { Input } from 'antd'
import { FC, useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../store/store'
import styles from './styles/chat.module.less'

const Chat: FC = () => {
  const [message, setMessage] = useState<any[]>([])
  const { store, dispatch } = useContext(StoreContext)
  useEffect( () => {
    store.client && store.client.on('message', (data: string) => {                  
      setMessage((message) => {
        return [
          ...message,
          JSON.parse(data)
        ]
      })
    })
  }, [store])

  const sendMessage = (message: string) => {
    store.client && store.client.sendMessage({
      send: store.name,
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