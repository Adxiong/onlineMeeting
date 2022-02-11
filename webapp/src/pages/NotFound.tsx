/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-11 13:37:42
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-11 13:41:15
 */

import { Button, Result } from "antd";
import { FC } from "react";

const NotFound: FC =  () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary">Back Home</Button>
      }
    />
  )
}

export default NotFound