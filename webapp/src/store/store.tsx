/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-18 18:15:48
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-07 17:41:50
 */
import { Button } from 'antd'
import React, { FC, useContext, useReducer, createContext, Dispatch, Children} from 'react'
import SocketClient from '../rtcPeer/socket'


interface StateType {
  name: string;
  roomId: string;
  client?: SocketClient;
  userInfoList: UserInfo[]
}
interface UserInfo {
  nick: string,
  id: string,
  roomId: string
}

const reducer = (state: StateType, actions: {type: string, payload: any}) => {
  switch (actions.type){
    case "setUserInfo": 
      return {
        ...state,
        name: actions.payload.name,
        roomId: actions.payload.roomId
      }
    case "setUserInfoList":
      state.userInfoList = actions.payload
      return {
        ...state
      }
    case "setSocket":
      return {
        ...state,
        client: actions.payload
      }
    default:
      return state
  }
}

interface ContextInterface {
  store: StateType,
  dispatch: Dispatch<{ 
    type: string;
    payload: any;
  }>
}

export const StoreContext = createContext({} as ContextInterface)

const Store: FC= ({children}) => {
  const [ store, dispatch ] = useReducer(reducer, {
    name: "",
    roomId: "",
    userInfoList: []
  })

  return (
    <div>
      <StoreContext.Provider value={{store,dispatch}}>
        {children}
      </StoreContext.Provider>
    </div>
  )
}

export default Store