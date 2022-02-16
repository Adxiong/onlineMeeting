/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-16 17:17:22
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-16 17:22:33
 */


import { FC } from 'react'
import { useParams } from 'react-router-dom'


const Room: FC = () => {
  const params = useParams()
 return (
   <div>
     <div>{params.roomId}</div>
   </div>
 ) 
}

export default Room