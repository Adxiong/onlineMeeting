/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-14 18:35:29
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-17 00:35:13
 */


import { FC, createContext, useState, useContext } from 'react'
import SocketClient from '../socket'

interface Props {

}

const Context:React.Context<any> = createContext(null)

const SocketContext: FC<Props> = (props) => {
  const [ socketState, setSocketState ] = useState<{
    client: SocketClient
  }>()
  return (
    <Context.Provider value={{socketState, setSocketState}}>
      {props.children}
    </Context.Provider>  
  )
}


export default SocketContext
export const useSocketContext: any = () => useContext(Context)