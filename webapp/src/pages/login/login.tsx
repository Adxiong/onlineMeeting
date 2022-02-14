/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-11 12:30:29
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-14 22:56:45
 */

import { Button, Form, Input, message } from 'antd';
import { FC, useEffect, useState } from 'react'; 
import loginStyle from './styles/login.module.less'
import { useSocketContext } from '../../hooks/useSocket';
import { useNavigate } from 'react-router-dom';
import SocketClient from "../../socket"

interface FormData {
  nickname: string
}

const Login: FC = () => {
  const { socketState, setSocketState} = useSocketContext()
  const [ form, setForm ] = useState<FormData>({
    nickname: ''
  })
  const navigator = useNavigate()  

  const joinRoom = () => {
    if(!form.nickname) {
      message.error("数据不能为空")
      return
    }

    socketState.connect(form.nickname)
    socketState.joinRoom({
      nickname: form.nickname
    })
    setSocketState({
      ...socketState,
      nickname: form.nickname
    })
    navigator('/video')

  }

  const formChange = (changeValues: string, form: FormData) => {
      setForm(form)
  }


  useEffect( () => {
    console.log(1);
    
    if (socketState) {
      navigator('/video')
      return
    } 
    const socket = new SocketClient('http://localhost:8000')
    setSocketState(socket)
  }, [])

  return (
    <div className={loginStyle.loginPanel}>
      <Form className={loginStyle.form}
        labelCol={{span:4}}
        labelAlign='left'
        wrapperCol={{span:16}}
        initialValues={form}
        onValuesChange={formChange}
      >
        <Form.Item>
          <h1>Wemeeting</h1>
        </Form.Item>
        <Form.Item label="昵称" name="nickname" >
          <Input type="text" placeholder='输入您的昵称...'/>
        </Form.Item>
        <Button type='primary' onClick={joinRoom}>加入房间</Button>
        <Button>取消</Button>
      </Form>
    </div>
  )
}

export default Login