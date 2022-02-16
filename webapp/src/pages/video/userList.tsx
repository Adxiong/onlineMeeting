/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-15 15:56:48
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-15 16:01:49
 */


import { Input } from 'antd'
import { FC } from 'react'
import UserListStyles from "./styles/userList.module.less"

interface UserInfoType {
  uid: string,
  nickname: string
}

interface UserListType{
  userList: UserInfoType[]
}

const UserList: FC = () => {
  return (
    <div className={UserListStyles.leftUsersPanel}>
      <div className={UserListStyles.search}>
        <Input type="search"></Input>
      </div>

      <div className={UserListStyles.userList}>
        {

        }
      </div>

    </div>
  )
}


export default UserList