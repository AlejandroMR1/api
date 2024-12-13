import React, { useState, useMemo, useEffect } from "react";
import { useTable } from "react-table";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "../firebase";
import { X } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import "./Employees.css";

const Employees = () => {
  const [employeesData, setEmployeesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    tipo_documento_identidad: "",
    numero_documento_identidad: "",
    primer_nombre: "",
    primer_apellido: "",
    fecha_nacimiento: "",
    edad: "",
    ciudad: "",
    correo: "",
    telefono: "",
    fecha_contratacion: "",
    cargo: "",
    departamento: "",
    estado_empleado: "Activo",
  });

  const fetchEmployees = async () => {
    try {
      const employeesCollection = collection(firestore, "empleados");
      const snapshot = await getDocs(employeesCollection);
      const employees = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployeesData(employees);
    } catch (err) {
      console.error("Error al cargar empleados:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const processedData = {
        ...formData,
        fecha_nacimiento: formData.fecha_nacimiento
          ? new Date(formData.fecha_nacimiento)
          : null,
        fecha_contratacion: formData.fecha_contratacion
          ? new Date(formData.fecha_contratacion)
          : null,
        edad: parseInt(formData.edad, 10),
      };
      const employeesCollection = collection(firestore, "empleados");
      await addDoc(employeesCollection, processedData);
      fetchEmployees();
      setShowAddForm(false);
      setFormData({
        tipo_documento_identidad: "",
        numero_documento_identidad: "",
        primer_nombre: "",
        primer_apellido: "",
        fecha_nacimiento: "",
        edad: "",
        ciudad: "",
        correo: "",
        telefono: "",
        fecha_contratacion: "",
        cargo: "",
        departamento: "",
        estado_empleado: "Activo",
      });
    } catch (err) {
      console.error("Error al agregar empleado:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const employeeDoc = doc(firestore, "empleados", id);
      await deleteDoc(employeeDoc);
      fetchEmployees();
    } catch (err) {
      console.error("Error al eliminar empleado:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const employeesColumns = useMemo(
    () => [
      {
        Header: "Acciones",
        id: "actions",
        Cell: ({ row }) => (
          <button
            onClick={() => handleDelete(row.original.id)}
            className="x-button"
          >
            <X size={15} />
          </button>
        ),
      },
      { Header: "Tipo de ID", accessor: "tipo_documento_identidad" },
      { Header: "ID", accessor: "numero_documento_identidad" },
      { Header: "Nombre(s)", accessor: "primer_nombre" },
      { Header: "Apellido(s)", accessor: "primer_apellido" },
      {
        Header: "Fecha de Nacimiento",
        accessor: "fecha_nacimiento",
        Cell: ({ value }) =>
          value?.seconds
            ? new Date(value.seconds * 1000).toLocaleDateString("es-CO")
            : "",
      },
      { Header: "Edad", accessor: "edad" },
      { Header: "Ciudad", accessor: "ciudad" },
      { Header: "Email", accessor: "correo" },
      { Header: "Teléfono", accessor: "telefono" },
      {
        Header: "Fecha de Contratación",
        accessor: "fecha_contratacion",
        Cell: ({ value }) =>
          value?.seconds
            ? new Date(value.seconds * 1000).toLocaleDateString("es-CO")
            : "",
      },
      { Header: "Cargo", accessor: "cargo" },
      { Header: "Departamento", accessor: "departamento" },
      { Header: "Estado del Empleado", accessor: "estado_empleado" },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: employeesColumns, data: employeesData });

  if (loading)
    return <div className="text-center p-4">Cargando empleados...</div>;

  return (
    <div className="table-container">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Gestión de Empleados
      </h1>
      {showAddForm && (
        <form onSubmit={handleAddEmployee} className="add-employee-form">
          <h2 className="form-title">Nuevo Empleado</h2>
          <div className="form-grid">
            {Object.keys(formData).map((key) => (
              <div className="form-group space-y-3" key={key}>
                <Label
                  htmlFor={key}
                  className="form-label text-gray-700 font-medium"
                >
                  {key.replace(/_/g, " ").toUpperCase()}
                </Label>
                <Input
                  id={key}
                  type={
                    key.includes("fecha")
                      ? "date"
                      : key === "edad"
                      ? "number"
                      : "text"
                  }
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                  className="form-input"
                  required
                />
              </div>
            ))}
          </div>
          <div className="button-group flex justify-center mt-10 space-x-8">
            <button
              type="button"
              className="x-button px-6 py-3"
              onClick={() => setShowAddForm(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="add-employee-button px-6 py-3">
              Guardar
            </button>
          </div>
        </form>
      )}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowAddForm(true)}
          className="add-employee-button"
        >
          Agregar Empleado
        </button>
      </div>
      <table {...getTableProps()} className="employee-table w-full mb-52">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Employees;