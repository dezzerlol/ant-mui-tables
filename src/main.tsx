import React from 'react'
import ReactDOM from 'react-dom/client'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import AntdProTable from './AntdTable/AntdTable.tsx'
import MuiDatagrid from './MuiDatagrid/MuiDatagrid.tsx'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/mui-table' replace />,
  },
  {
    path: '/mui-table',
    element: <MuiDatagrid />,
  },
  {
    path: '/antd-table',
    element: <AntdProTable />,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
