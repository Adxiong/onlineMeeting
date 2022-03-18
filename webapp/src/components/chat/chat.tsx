/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-16 17:25:24
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-17 18:02:11
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
  const textareaRef = useRef<Input>(null)
  const TextContentRef = useRef<HTMLDivElement>(null)
  
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

  const inputPressEnter = (e: any) => {    
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

  const inputChange = (e: any) => {
    setTextValue(e.target.innerText)
  }

  const onClickEmoji = (emoji: string) => {
    const value = textValue.substring(0, textValueCurrentIndex) + emoji + textValue.substring(textValueCurrentIndex)    
    setTextValue(value)        
    TextContentRef.current!.innerText = value
    TextContentRef.current?.focus()
    setTextValueCurrentIndex(value.length)
    setEmojiPickerDisplay(!emojiPickerDisplay)
  }

  const displayEmoji = (e)=> {
    setEmojiPickerDisplay(!emojiPickerDisplay)
  }

  const setValueCurrentIndex = (e: any) => {
    const selection = window.getSelection()
    if(selection){
      setTextValueCurrentIndex(selection.focusOffset)
    }

    if (e.keyCode === 13 && e.ctrlKey) {      
      setTextValue(textValue+"\n")
      return
    }
    if (e.keyCode === 13) {
      e.preventDefault()
      let data = TextContentRef.current?.innerHTML
      if (data) {
        data = data
        .replace(/<div><br><\/div>/, "")
        .replace(/<script>.*?<\/script>>/, "")
        sendMessage(data)
        setTextValue("")
        TextContentRef.current!.innerText = ""
      }
    }
  }

  const pasteEvent = (e) => {
    console.table(e.clipboardData.items);
    e.preventDefault()
    const data = e.clipboardData.items[0]
    switch (data.kind) {
      case 'string':
        data.getAsString((str: string)=>{
          TextContentRef.current!.innerHTML += str
        })
      case "file":
        const file = data.getAsFile()
        console.log(file);    
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
        <div 
          ref={TextContentRef}
          contentEditable="true"
          style={{height: 200}}
          onClick={setValueCurrentIndex}
          onKeyUp={setValueCurrentIndex}
          onInput={inputChange}
          onPaste={pasteEvent}
        > 

        </div>
        {/* <TextArea 
          ref={textareaRef}
          value={textValue}
          autoFocus
          style={{resize: 'none'}}
          rows={4} 
          bordered={false} 
          onClick={setValueCurrentIndex}
          onKeyUp={setValueCurrentIndex}
          onChange={inputChange}
          onPressEnter={inputPressEnter}></TextArea>
          */}
      </div> 
    </div>
  )
}

export default Chat