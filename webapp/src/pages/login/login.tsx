/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-11 12:30:29
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-16 17:16:01
 */

import { Button, Form, Input, message, Space } from 'antd';
import { FC, useEffect, useState } from 'react'; 
import loginStyle from './styles/login.module.less'
import { useSocketContext } from '../../hooks/useSocket';
import { useNavigate } from 'react-router-dom';
import SocketClient from "../../socket"
import Utils from '../../utils/util';

interface FormData {
  nickname: string
  roomId: string
}

const Login: FC = () => {
  const { socketState, setSocketState} = useSocketContext()
  const [ form, setForm ] = useState<FormData>({
    nickname: '',
    roomId: "",
  })
  const navigator = useNavigate()  

  const joinRoom = () => {
    if(!form.nickname || !form.roomId) {
      message.error("数据不能为空")
      return
    }

    try {
      const client:SocketClient = new SocketClient()
      client.connect()
      client.joinRoom({
        nickname: form.nickname,
        roomId: form.roomId
      })
      setSocketState({
        ...form,
        client
      })
      navigator(`/room/${form.roomId}`)
    }
    catch(e) {
      navigator(`/`)
    }

  }

  const createRoom = () => {
    if(!form.nickname) {
      message.error("数据不能为空")
      return
    }
    
    const roomId = Utils.uuid()
    navigator(`/room/${roomId}`)
  }

  const formChange = (changeValues: string, form: FormData) => {
      setForm(form)
  }

  // useEffect( () => {    
  //   if (socketState) {
  //     navigator('/room')
  //     return
  //   } 
  // }, [])

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
        <Form.Item 
          label="昵称" 
          name="nickname" 
          rules={
            [
              {required: true, message: "数据不能为空"},
            ]
          }
          >
          <Input type="text" placeholder='输入您的昵称...'/>
        </Form.Item>
        <Form.Item label="房间号" name="roomId">
          <Input type='text' placeholder='输入房间号...'></Input>
        </Form.Item>
        <Space>
          <Button type='primary' onClick={joinRoom}>加入房间</Button>
          <Button type='primary' onClick={createRoom}>创建房间</Button>
        </Space>
      </Form>
    </div>
  )
}

export default Login