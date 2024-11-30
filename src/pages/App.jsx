import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Home';
import Attendance from './Attendance';
import Employees from './Employees';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,

  },
  {
    path: "/attendance",
    element: <Attendance />,

  },
  {
    path: "/employees",
    element: <Employees />,

  },
  {
    path: "/reporteuno",
    element: <ReporteUno />,

  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
  );
