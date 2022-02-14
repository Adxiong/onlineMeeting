/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-14 18:35:29
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-14 22:30:47
 */


import { FC, createContext, useState, useContext } from 'react'

interface Props {

}

const Context:React.Context<any> = createContext(null)

const SocketContext: FC<Props> = (props) => {
  const [ socketState, setSocketState ] = useState()
  return (
    <Context.Provider value={{socketState, setSocketState}}>
      {props.children}
    </Context.Provider>  
  )
}


export default SocketContext
export const useSocketContext: any = () => useContext(Context)