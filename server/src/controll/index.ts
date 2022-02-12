/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-12 18:52:56
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-02-12 18:57:32
 */


import { Router } from 'express'
import login from './login'
import chat from './chat'

const router = Router()

router.use('/login', login)
router.use('/chat', chat)

export default router


