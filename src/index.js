import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from "../src/pages/Header"
import Login from "../src/pages/Login"
import Home from "../src/pages/Home"
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Employees from '../src/pages/Employees'
import Attendance from '../src/pages/Attendance'
import ReporteUno from './pages/ReporteUno'



let router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>
  },

  {
    path: "/home",
    element: <Home/>
  },

  {path: "/header",
    element: <Header/>
  },

  {path: "/employees",
    element: <Employees/>
  },

  {
    path: "/attendance",
    element: <Attendance/>
  },
  {
    path: "/reporteuno",
    element: <ReporteUno/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)