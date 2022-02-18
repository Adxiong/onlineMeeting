/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-10 15:48:30
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-19 00:09:28
 */
import { Button } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import './App.css'
import Routes from './routes';
import StoreContext from './store/store';




function App() {
  
  useEffect( () => {    
  }, [])

  return (
    <div className="App">
      <StoreContext>
        <Routes></Routes>
      </StoreContext>
    </div>
  )
}

export default App
