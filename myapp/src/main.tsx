import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.less'
import { RouterProvider } from 'react-router-dom'
import router from './routers'




ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <RouterProvider router={router}/>
)
