import React from 'react'
import "./Aside.css"
import { useNavigate, Link } from 'react-router-dom'



const Aside = () => {
    
  return (

    <aside className='home-sidebar'>

        <br />
        <br />
        <br />
        <br />
        <Link to="/home">Página Principal</Link>
        <br />
        <Link to="/attendance">Asistencia</Link>
        <Link to="/attendance-table">Tabla de Asistencia</Link>
        <Link to="/report-table">Tabla de Reportes</Link>
        <Link to="/attendance-adjusment-table">Tabla de Ajustes de Asistencias</Link>
        <Link to="/managers-table">Tabla de Administradores</Link>
        <br />
        <Link to="/employees">Empleados</Link>

    </aside>


  )
}

export default Aside