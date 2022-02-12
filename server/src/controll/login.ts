/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-12 18:45:06
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-12 18:52:50
 */


import { Router, Response, Request, NextFunction } from 'express';
 
const router = new Router()

router.post('login', (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.username) {
    return res.json()
    return
  }
  
})


export default router