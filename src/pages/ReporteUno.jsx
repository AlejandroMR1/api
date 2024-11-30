import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { firestore } from '../firebase';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReporteUno = () => {
  // Estados para el generador de reportes
  const [tipoReporte, setTipoReporte] = useState('mensual');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [empleados, setEmpleados] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('todos');
  const [datosReporte, setDatosReporte] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Cargar lista de empleados
  useEffect(() => {
    const obtenerEmpleados = async () => {
      try {
        const empleadosRef = collection(firestore, 'reportes');
        const snapshot = await getDocs(empleadosRef);
        
        // Depuración: verificar datos reales
        console.log("Snapshot de empleados:", snapshot.docs.map(doc => doc.data()));
        
        const listaEmpleados = snapshot.docs.map(doc => ({
          id: doc.id,
          nombre: doc.data().nombreEmpleado || doc.data().nombre || 'Sin nombre'
        })).filter(empleado => empleado.nombre !== 'Sin nombre');
        
        setEmpleados(listaEmpleados);
      } catch (error) {
        console.error("Error al cargar empleados:", error);
        setError(`No se pudo cargar la lista de empleados: ${error.message}`);
      }
    };

    obtenerEmpleados();
  }, []);

  // Generar reporte
  const generarReporte = async () => {
    setError(null);
    setCargando(true);

    try {
      if (!fechaInicio || !fechaFin) {
        setError('Por favor, selecciona un rango de fechas');
        setCargando(false);
        return;
      }

      const inicioDate = Timestamp.fromDate(new Date(fechaInicio));
      const finDate = Timestamp.fromDate(new Date(fechaFin));
      finDate.seconds += 86399; // Agregar 23:59:59

      // Construcción de consulta más flexible
      const consultaBase = [
        where('fecha', '>=', inicioDate),
        where('fecha', '<=', finDate)
      ];

      // Agregar filtro de empleado si está seleccionado
      if (empleadoSeleccionado !== 'todos') {
        consultaBase.push(where('nombreEmpleado', '==', empleadoSeleccionado));
      }

      console.log(consultaBase);

      const consultaAsistencia = query(
        collection(firestore, 'reportes'),
        ...consultaBase
      );

      const snapshot = await getDocs(consultaAsistencia);
      
      if (snapshot.empty) {
        setError('No se encontraron registros para el rango de fechas seleccionado');
        setDatosReporte([]);
        setCargando(false);
        return;
      }

      const datos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const reporteProcesado = procesarDatosAsistencia(datos);
      setDatosReporte(reporteProcesado);
      setCargando(false);
    } catch (error) {
      console.error("Error al generar reporte:", error);
      setError(`Ocurrió un error al generar el reporte: ${error.message}`);
      setCargando(false);
    }
  };

  // Procesar datos de asistencia con más validaciones
  const procesarDatosAsistencia = (datos) => {
    return datos.map(registro => ({
      nombreEmpleado: registro.nombreEmpleado || 'Sin nombre',
      fecha: registro.fecha 
        ? (registro.fecha instanceof Timestamp 
          ? registro.fecha.toDate().toLocaleDateString() 
          : new Date(registro.fecha).toLocaleDateString())
        : 'Fecha no disponible',
      horaEntrada: registro.horaEntrada || 'N/A',
      horaSalida: registro.horaSalida || 'N/A',
      horasTrabajadas: calcularHorasTrabajadas(registro.horaEntrada, registro.horaSalida)
    }));
  };

  // Calcular horas trabajadas
  const calcularHorasTrabajadas = (entrada, salida) => {
    if (!entrada || !salida) return '0';
    try {
      const [horaEntrada, minutosEntrada] = entrada.split(':').map(Number);
      const [horaSalida, minutosSalida] = salida.split(':').map(Number);

      const fechaEntrada = new Date(0, 0, 0, horaEntrada, minutosEntrada);
      const fechaSalida = new Date(0, 0, 0, horaSalida, minutosSalida);
      
      const diferenciaMs = fechaSalida - fechaEntrada;
      const horas = diferenciaMs / (1000 * 60 * 60);
      
      return horas.toFixed(2);
    } catch (error) {
      console.error("Error calculando horas:", error);
      return '0';
    }
  };

  // Exportar a Excel
  const exportarExcel = () => {
    const hoja = XLSX.utils.json_to_sheet(datosReporte);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Reporte Asistencia");
    
    XLSX.writeFile(`reporte_asistencia_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Exportar a PDF
  const exportarPDF = () => {
    if (datosReporte.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const doc = new jsPDF('landscape');
    doc.text("Reporte de Asistencia", 14, 15);
    
    doc.autoTable({
      startY: 25,
      head: [['Nombre', 'Fecha', 'Hora Entrada', 'Hora Salida', 'Horas Trabajadas']],
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
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}

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
              <option key={empleado.id} value={empleado.nombre}>
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
          disabled={cargando}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {cargando ? 'Generando...' : 'Generar Reporte'}
        </button>
        <button 
          onClick={exportarExcel}
          disabled={datosReporte.length === 0 || cargando}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Exportar Excel
        </button>
        <button 
          onClick={exportarPDF}
          disabled={datosReporte.length === 0 || cargando}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          Exportar PDF
        </button>
      </div>

      {datosReporte.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Reporte Generado</h3>
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Nombre</th>
                <th className="border p-2">Fecha</th>
                <th className="border p-2">Hora Entrada</th>
                <th className="border p-2">Hora Salida</th>
                <th className="border p-2">Horas Trabajadas</th>
              </tr>
            </thead>
            <tbody>
              {datosReporte.map((fila, index) => (
                <tr key={index}>
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

export default ReporteUno;
