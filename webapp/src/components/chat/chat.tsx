/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-16 17:25:24
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-16 21:30:57
 */

import { Input } from 'antd'
import { FC, useContext, useEffect, useRef, useState } from 'react'
import { StoreContext } from '../../store/store'
import styles from './styles/chat.module.less'
import Message from './message'
import RTCPeer from '../../rtcPeer'
import { DcMessage } from '../../rtcPeer/@types'
import EmojiPicker from '../emojiPicker/emojiPicker'
import TextArea from 'antd/lib/input/TextArea'

const Chat = ({peer}: {peer: RTCPeer}) => {
  const [message, setMessage] = useState<DcMessage[]>([])
  const [textValue, setTextValue] = useState<string>("")
  const [emojiPickerDisplay, setEmojiPickerDisplay] = useState<boolean>(false)
  const [textValueCurrentIndex, setTextValueCurrentIndex] = useState<number>(0)
  const textareaRef = useRef(null)
  
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
    if (e.keyCode === 13 && e.ctrlKey) {
      setTextValue(textValue+"\n")
      return
    }
    if (e.keyCode === 13) {
      sendMessage(textValue)
      setTextValue("")
      e.preventDefault()
    }

  }

  const inputChange = (e) => {
    console.log(e.target.selectionStart);

    setTextValue(e.target.value)
  }

  const onClickEmoji = (emoji: string) => {
    // console.log(textareaRef.current);
    console.log(textValueCurrentIndex);
    
    setTextValue(textValue.substring(0, textValueCurrentIndex) + emoji + textValue.substring(textValueCurrentIndex))    
    textareaRef.current?.focus()
    setEmojiPickerDisplay(!emojiPickerDisplay)
  }

  const focuChange = (e) => {
    setTextValueCurrentIndex(e.target.selectionStart)
  }
  const clickChange = (e) => {
    setTextValueCurrentIndex(e.target.selectionStart)
  }

  const displayEmoji = (e)=> {
    setEmojiPickerDisplay(!emojiPickerDisplay)
  }

  const keyDown = (e: any) => {
    const index = e.target.selectionStart
    console.log(index, e.target.selectionEnd);
    
    if (e.code == 'ArrowLeft' && index > 0) {
      setTextValueCurrentIndex(index-1)
    }
    if (e.code === 'ArrowRight') {
      setTextValueCurrentIndex(index + 1)
    }
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
          <span onClick={displayEmoji}>😊</span>
          {
            emojiPickerDisplay && <EmojiPicker clickEmoji={onClickEmoji}/>
          }
        </div>
        <TextArea 
          ref={textareaRef}
          value={textValue}
          autoFocus
          style={{resize: 'none'}}
          rows={4} 
          bordered={false} 
          onClick={clickChange}
          onFocus={focuChange}
          onChange={inputChange}
          onKeyDown={keyDown}
          onPressEnter={inputPressEnter}></TextArea>
      </div>
    </div>
  )
}

export default Chat