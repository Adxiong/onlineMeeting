/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-16 17:25:24
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-08 20:38:43
 */

import { Input } from 'antd'
import { FC, useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../store/store'
import styles from './styles/chat.module.less'
import Message from './message'

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

  const sendMessage = (value: string) => {
    // store.client && store.client.sendMessage({
    //   type: 'group',
    //   send: store.name,
    //   message
    // })
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