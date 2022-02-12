/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-12 18:55:17
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-12 18:57:00
 */

import { Router, Request, Response, NextFunction } from "express"


const router = Router()


router.post('/:id', (req: Request, res: Response, next: NextFunction) => {
  if(!req.params.id) {
    res.json()
    return
  }
})

export default router