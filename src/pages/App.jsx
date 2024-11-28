import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Home';
import Attendance from './Attendance';
import Reportes from './Reportes';
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
    path: "/reportes",
    element: <Reportes />,

  },
  {
    path: "/employees",
    element: <Employees />,

  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
  );
