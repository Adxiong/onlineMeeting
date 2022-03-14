/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-19 15:16:53
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-15 00:05:20
 */

import { Avatar } from 'antd'
import { FC, useEffect, useRef } from 'react'
import { DcMessage } from '../../rtcPeer/@types'
import style from './styles/message.module.less'

interface Props {
  message: DcMessage[]
}

const Message: FC<Props> = (props) => {
  const messageRef = useRef<HTMLDivElement>(null)
  useEffect( () => {    
    messageRef.current?.scrollIntoView(false)
  }, [props.message])
  return (
    
      <div className={style.messagePanel} ref={messageRef}>
      {
        props.message.map( item => (
          <div className={style.messageItem} key={item.sendId + item.sendTime}>
            <Avatar className={style.avatar} size={40}>{item.sendNick}</Avatar>
            <div className={style.messageContent}>
              <div className={style.name}>{item.sendNick}</div>
              <div className={style.content}>{item.content}</div>
            </div>
          </div>
        ))
      }
    </div>
    
  )
}

export default Message