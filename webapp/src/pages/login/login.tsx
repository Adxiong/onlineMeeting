/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-11 12:30:29
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-18 23:27:44
 */

import { Button, Form, Input, message, Space } from 'antd';
import { FC, useContext, useEffect, useState } from 'react'; 
import loginStyle from './styles/login.module.less'
import { useNavigate } from 'react-router-dom';
import Utils from '../../utils/util';
import { StoreContext } from '../../store/store';

interface FormData {
  name: string
  roomId: string
}

const Login: FC = () => {
  const { store, dispatch} = useContext(StoreContext)
  const [ form, setForm ] = useState<FormData>({
    name: '',
    roomId: "",
  })
  const navigator = useNavigate()  

  const joinRoom = () => {
    if(!form.name || !form.roomId) {
      message.error("数据不能为空")
      return
    }
    try {
      dispatch({
        type: 'setUserInfo',
        payload: form
      })      
      
      window.localStorage.setItem('userInfo', JSON.stringify({
        ...form,
      }))
      navigator(`/room/${form.roomId}`)
    }
    catch(e) {
      navigator(`/`)
    }

  }

  const createRoom = () => {
    if(!form.name) {
      message.error("数据不能为空")
      return
    }
    
    const roomId = Utils.uuid()
    navigator(`/room/${roomId}`)
  }

  const formChange = (changeValues: string, form: FormData) => {
      setForm(form)
  }

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
          name="name" 
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