/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-19 15:16:53
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-19 15:34:21
 */

import { Avatar } from 'antd'
import { FC } from 'react'
import style from './styles/message.module.less'

interface Props {
  message: {
    type: string,
    send: string,
    content: string,
    date: number
  }[]
}

const Message: FC<Props> = (props) => {
  return (
    <div className={style.messagePanel}>
      {
        props.message.map( item => (
          <div className={style.messageItem} key={item.send + item.date}>
            <Avatar className={style.avatar} size={40}>{item.send}</Avatar>
            <div className={style.messageContent}>
              <div className={style.name}>{item.send}</div>
              <div className={style.content}>{item.content}</div>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default Message