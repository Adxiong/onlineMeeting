/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-10 15:48:30
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-11 17:06:41
 */
import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import * as io from 'socket.io-client';
import './App.css'
import Routes from './routes';

const socket = io.connect('http://localhost:8000',{
  withCredentials: true,
  transports: ['websocket']
});



function App() {
  

  useEffect( () => {    
    socket.on('connect', function() {
      console.log('ws connect.');
    });
    
    socket.on("message", (res) => {
      console.log(res);
    })
    socket.on('connect_error', function() {
        console.log('ws connect_error.');
    });
    
    socket.on('error', function(errorMessage) {
        console.log('ws error, ' + errorMessage);
    })}, [])

  return (
    <div className="App">
      <Routes></Routes>

    </div>
  )
}

export default App
