/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-16 17:17:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-17 15:38:19
 */


import { Button } from 'antd'
import { FC } from 'react'
import { useParams } from 'react-router-dom'
import Chat from '../../components/chat/chat'
import Video from '../video/video'
import style from './styles/room.module.less'


const Room: FC = () => {
  const params = useParams()
 return (
   <div className={style.roomPanel}>
     <div className={style.videoArea}>
       <div className={style.personVideo}>
        <div className={style.videoEle}>
          <video src=""></video>
        </div>
        <div className={style.personName}>
          <span></span>
        </div>
       </div>
       <div>
         <Button>静音</Button>
         <Button>打开视频</Button>
         <Button>屏幕共享</Button>
       </div>
       {params.roomId}
      </div>
     <Chat></Chat>
   </div>
 ) 
}

export default Room