import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from '../firebase';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Reportes = () => {
  // Estados para el generador de reportes
  const [tipoReporte, setTipoReporte] = useState('mensual');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [empleados, setEmpleados] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('todos');
  const [datosReporte, setDatosReporte] = useState([]);

  // Cargar lista de empleados
  useEffect(() => {
    const obtenerEmpleados = async () => {
      try {
        const empleadosRef = collection(firestore, 'empleados');
        const snapshot = await getDocs(empleadosRef);
        const listaEmpleados = snapshot.docs.map(doc => ({
          id: doc.id,
          nombre: doc.data().nombre
        }));
        setEmpleados(listaEmpleados);
      } catch (error) {
        console.error("Error al cargar empleados:", error);
      }
    };

    obtenerEmpleados();
  }, []);

  // Generar reporte
  const generarReporte = async () => {
    try {
      // Validar fechas
      if (!fechaInicio || !fechaFin) {
        alert('Por favor, selecciona un rango de fechas');
        return;
      }

      // Consulta de asistencia con filtros
      const consultaAsistencia = query(
        collection(firestore, 'asistencia'),
        where('fecha', '>=', new Date(fechaInicio)),
        where('fecha', '<=', new Date(fechaFin)),
        ...(empleadoSeleccionado !== 'todos' 
          ? [where('empleadoId', '==', empleadoSeleccionado)] 
          : [])
      );

      const snapshot = await getDocs(consultaAsistencia);
      const datos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Procesar datos de asistencia
      const reporteProcesado = procesarDatosAsistencia(datos);
      setDatosReporte(reporteProcesado);
    } catch (error) {
      console.error("Error al generar reporte:", error);
    }
  };

  // Procesar datos de asistencia
  const procesarDatosAsistencia = (datos) => {
    return datos.map(registro => ({
      nombreEmpleado: registro.nombreEmpleado,
      fecha: registro.fecha.toDate().toLocaleDateString(),
      horaEntrada: registro.horaEntrada,
      horaSalida: registro.horaSalida,
      horasTrabajadas: calcularHorasTrabajadas(registro.horaEntrada, registro.horaSalida)
    }));
  };

  // Calcular horas trabajadas
  const calcularHorasTrabajadas = (entrada, salida) => {
    if (!entrada || !salida) return '0';
    const fechaEntrada = new Date();
    fechaEntrada.setHours(entrada.split(':')[0], entrada.split(':')[1], 0, 0);
    
    const fechaSalida = new Date();
    fechaSalida.setHours(salida.split(':')[0], salida.split(':')[1], 0, 0);
    return ((fechaSalida - fechaEntrada) / (1000 * 60 * 60)).toFixed(2);
  };

  // Exportar a Excel
  const exportarExcel = () => {
    const hoja = XLSX.utils.json_to_sheet(datosReporte);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Reporte Asistencia");
    XLSX.writeFile(libro, `reporte_asistencia_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Exportar a PDF
  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Asistencia", 14, 15);
    
    doc.autoTable({
      head: [['Empleado', 'Fecha', 'Hora Entrada', 'Hora Salida', 'Horas Trabajadas']],
      body: datosReporte.map(fila => [
        fila.nombreEmpleado, 
        fila.fecha, 
        fila.horaEntrada, 
        fila.horaSalida, 
        fila.horasTrabajadas
      ])
    });

    doc.save(`reporte_asistencia_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Generación de Reportes de Asistencia</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Tipo de Reporte</label>
          <select 
            value={tipoReporte} 
            onChange={(e) => setTipoReporte(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="mensual">Mensual</option>
            <option value="semanal">Semanal</option>
            <option value="personalizado">Personalizado</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Empleado</label>
          <select 
            value={empleadoSeleccionado}
            onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="todos">Todos los Empleados</option>
            {empleados.map(empleado => (
              <option key={empleado.id} value={empleado.id}>
                {empleado.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Fecha de Inicio</label>
          <input 
            type="date" 
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Fecha de Fin</label>
          <input 
            type="date" 
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <button 
          onClick={generarReporte}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          //Generar Reporte
        </button>
        <button 
          onClick={exportarExcel}
          disabled={datosReporte.length === 0}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          //Exportar Excel
        </button>
        <button 
          onClick={exportarPDF}
          disabled={datosReporte.length === 0}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          Exportar PDF
        </button>
      </div>

      {datosReporte.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Resultados del Reporte</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Empleado</th>
                <th className="border p-2">Fecha</th>
                <th className="border p-2">Hora Entrada</th>
                <th className="border p-2">Hora Salida</th>
                <th className="border p-2">Horas Trabajadas</th>
              </tr>
            </thead>
            <tbody>
              {datosReporte.map((fila, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2">{fila.nombreEmpleado}</td>
                  <td className="border p-2">{fila.fecha}</td>
                  <td className="border p-2">{fila.horaEntrada}</td>
                  <td className="border p-2">{fila.horaSalida}</td>
                  <td className="border p-2">{fila.horasTrabajadas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reportes;