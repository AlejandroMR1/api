import React, { useState, useEffect } from 'react';
import "./Attendance.css";
import Header from "./Header";
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { TiTimes } from "react-icons/ti";
import { MdOutlineWatchLater } from "react-icons/md";

// Componente para mostrar los datos de asistencia
function Attendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [employeesData, setEmployeesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener datos de los empleados y de la asistencia
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos de empleados
        const employeesCollection = collection(firestore, 'empleados');
        const employeesSnapshot = await getDocs(employeesCollection);
        const employeesList = employeesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEmployeesData(employeesList);

        // Obtener datos de asistencia
        const attendanceCollection = collection(firestore, 'asistencia');
        const attendanceSnapshot = await getDocs(attendanceCollection);
        const attendanceList = attendanceSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAttendanceData(attendanceList);

        // Una vez que ambos datos estén cargados, cambia el estado de loading
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar los datos: ", err);
        setError(err.message);
        setLoading(false); // Asegúrate de desactivar el loading en caso de error
      }
    };

    fetchData();
  }, []); // El arreglo vacío asegura que se ejecute solo una vez al montar el componente

  // Función para cambiar el estado de asistencia
  const handleAttendanceChange = (index, value) => {
    const newData = [...attendanceData];
    newData[index].attendance = value;
    setAttendanceData(newData);
  };

  // Función para mostrar los íconos de asistencia
  const renderAttendanceIcon = (value) => {
    switch (value) {
      case "presente":
        return <IoCheckmarkCircleSharp className="attendance-icon" style={{ color: 'green' }} />;
      case "ausente":
        return <TiTimes className="attendance-icon" style={{ color: 'red' }} />;
      case "tardanza":
        return <MdOutlineWatchLater className='attendance-icon' style={{ color: "blue" }} />;
      default:
        return "-";
    }
  };

  // Combina datos de empleados y asistencia por el campo numero_documento_identidad
  const mergedData = employeesData.map(employee => {
    const employeeAttendance = attendanceData.find(att => att.numero_documento_identidad === employee.numero_documento_identidad);
    return {
      ...employee,
      attendance: employeeAttendance ? employeeAttendance.novedades_asistencia : "-",
      attendanceId: employeeAttendance ? employeeAttendance.id : null
    };
  });

  // Mostrar la carga de datos mientras los datos están siendo obtenidos
  if (loading) {
    return <div>Cargando datos...</div>;
  }

  // Mostrar el error si ocurre
  if (error) {
    return <div>Error al cargar los datos: {error}</div>;
  }

  return (
    <div>
      <Header />
      <table className='attendance-table'>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Puesto</th>
            <th>Departamento</th>
            <th>Fecha</th>
            <th>Asistencia</th>
          </tr>
        </thead>
        <tbody>
          {mergedData.map((row, index) => (
            <tr key={row.id}>
              <td>{row.primer_nombre} {row.primer_apellido}</td>
              <td>{row.primer_apellido}</td>
              <td>{row.correo}</td>
              <td>{row.telefono}</td>
              <td>{row.cargo}</td>
              <td>{row.departamento}</td>
              <td>{new Date().toLocaleDateString('es-CO')}</td>
              <td>
                <div className="attendance-select-container">
                  <select onChange={(e) => handleAttendanceChange(index, e.target.value)}>
                    <option value="">-</option>
                    <option value="presente">Presente</option>
                    <option value="ausente">Ausente</option>
                    <option value="tardanza">Tarde</option>
                  </select>
                  <span className="attendance-icon">
                    {renderAttendanceIcon(row.attendance)} {}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Attendance;