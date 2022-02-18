/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-18 18:15:48
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-18 23:34:35
 */
import { FC, useContext, useReducer, createContext, Dispatch} from 'react'
import { Outlet } from 'react-router-dom'
import SocketClient from '../socket'
import { SETSOCKET, SETUSERINFO } from './constant'


interface StateType {
  name: string;
  roomId: string;
  client?: SocketClient
}

const reducer = (state: StateType, actions: {type: string, payload: any}) => {
  switch (actions.type){
    case SETUSERINFO: 
      return {
        ...state,
        name: actions.payload.name,
        roomId: actions.payload.roomId
      }
    case SETSOCKET:
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


export const StoreContext = createContext({})

const Store: FC = () => {
  const [ store, dispatch ] = useReducer(reducer, {
    name: "",
    roomId: "",
  })

  return (
    <StoreContext.Provider value={{store,dispatch}}>
      <Outlet/>
    </StoreContext.Provider>
  )
}

export default Store