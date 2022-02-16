/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-16 17:25:24
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-16 21:44:53
 */

import { FC } from 'react'
import styles from './styles/chat.module.less'

const Chat: FC = () => {
  return (
    <div className={styles.chatPanel}>
      <div className={styles.messageBox}>

      </div>
      <div className={styles.messageInputPanel}>

      </div>
    </div>
  )
}

export default Chat