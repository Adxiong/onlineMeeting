/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-10 15:48:30
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-14 22:14:46
 */
import { Button } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import './App.css'
import Routes from './routes';
import SocketContext from './hooks/useSocket';




function App() {
  
  useEffect( () => {    
  }, [])

  return (
    <div className="App">
      <SocketContext>
        <Routes></Routes>
      </SocketContext>
    </div>
  )
}

export default App
