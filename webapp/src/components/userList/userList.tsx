/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-03-01 19:27:10
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-10 23:44:46
 */

import { Avatar } from 'antd'
import { FC, useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../store/store'
import styles from './styles/userList.module.less'

const UserList: FC = () => {

  const { store, dispatch } = useContext(StoreContext)  
  return (
    <div className={styles.UserListPanel}>
      {
        store.userInfoList.map( (user, index) => (
          <div key={index+user.nick}>
            <Avatar>{user.nick}</Avatar>
            <span>{user.nick}</span>
          </div>
        ))
      }
    </div>
  )
}

export default UserList