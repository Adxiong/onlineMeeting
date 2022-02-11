/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-11 12:30:29
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-11 18:13:48
 */

import { Button, Form, Input } from 'antd';
import { FC } from 'react'; 
import loginStyle from './styles/login.module.less'

const Login: FC = () => {
  return (
    <div className={loginStyle.loginPanel}>
      <Form className={loginStyle.form}
        labelCol={{span:4}}
        labelAlign='left'
        wrapperCol={{span:16}}
      >
        <Form.Item>
          <h1>Wemeeting</h1>
        </Form.Item>
        <Form.Item label="昵称" >
          <Input type="text"></Input>
        </Form.Item>
        <Button type='primary'>加入房间</Button>
        <Button>取消</Button>
      </Form>
    </div>
  )
}

export default Login