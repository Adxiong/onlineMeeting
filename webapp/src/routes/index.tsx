/*
 * @Description: 
 * @version: 
 * @Author: Adxiong
 * @Date: 2022-02-11 13:06:54
 * @LastEditors: Adxiong
 * @LastEditTime: 2022-03-12 14:21:07
 */

import { FC } from 'react'
import { useRoutes, Outlet, Navigate } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import Login from '../pages/login/login';
import Room from '../pages/room/room';

export interface RoutesType  {
  path: string;
  element: JSX.Element;
  children?: RoutesType[];
}

const Routes: RoutesType[] = [
  {
    path: '/',
    element: <Navigate replace to='/login'/>
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/room/:roomId',
    element: <Room/>
  },
  {
    path: '/404',
    element: <NotFound />
  },
  {
    path: '*',
    element: <Navigate replace to={'/404'}/>
  }
]

const GetRoutes:FC = () => {
  return useRoutes(Routes)
}

export default GetRoutes