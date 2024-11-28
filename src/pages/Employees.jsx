import React, { useState, useMemo, useEffect } from 'react';
import { useTable, useGlobalFilter, useAsyncDebounce } from 'react-table';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { X } from 'lucide-react';
import Header from './Header';
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import "./Employees.css";


// Componente de filtro para la tabla de empleados
const EmployeesFilter = ({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div className="flex gap-2 items-center">
      <Label htmlFor="search">Buscar:</Label>
      <Input
        id="search"
        value={value || ""}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} registros...`}
        className="max-w-sm"
      />
    </div>
  );
};

// Componente del modal para agregar empleados

const AddEmployeeModal = ({ isOpen, setIsOpen, onAddEmployee }) => {
  const [formData, setFormData] = useState({
    tipo_documento_identidad: '',
    numero_documento_identidad: '',
    primer_nombre: '',
    primer_apellido: '',
    fecha_nacimiento: '',
    edad: '',
    ciudad: '',
    correo: '',
    telefono: '',
    fecha_contratacion: '',
    cargo: '',
    departamento: '',
    estado_empleado: 'Activo'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convertir fechas a objetos Date para Firestore
    const processedData = {
      ...formData,
      fecha_nacimiento: new Date(formData.fecha_nacimiento),
      fecha_contratacion: new Date(formData.fecha_contratacion),
      edad: parseInt(formData.edad, 10)
    };
    onAddEmployee(processedData);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Empleado</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo_documento_identidad">Tipo de ID</Label>
              <Input
                id="tipo_documento_identidad"
                value={formData.tipo_documento_identidad}
                onChange={(e) => setFormData({...formData, tipo_documento_identidad: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numero_documento_identidad">Número de ID</Label>
              <Input
                id="numero_documento_identidad"
                value={formData.numero_documento_identidad}
                onChange={(e) => setFormData({...formData, numero_documento_identidad: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primer_nombre">Nombre(s)</Label>
              <Input
                id="primer_nombre"
                value={formData.primer_nombre}
                onChange={(e) => setFormData({...formData, primer_nombre: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primer_apellido">Apellido(s)</Label>
              <Input
                id="primer_apellido"
                value={formData.primer_apellido}
                onChange={(e) => setFormData({...formData, primer_apellido: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
              <Input
                id="fecha_nacimiento"
                type="date"
                value={formData.fecha_nacimiento}
                onChange={(e) => setFormData({...formData, fecha_nacimiento: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edad">Edad</Label>
              <Input
                id="edad"
                type="number"
                value={formData.edad}
                onChange={(e) => setFormData({...formData, edad: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input
                id="ciudad"
                value={formData.ciudad}
                onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="correo">Email</Label>
              <Input
                id="correo"
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({...formData, correo: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_contratacion">Fecha de Contratación</Label>
              <Input
                id="fecha_contratacion"
                type="date"
                value={formData.fecha_contratacion}
                onChange={(e) => setFormData({...formData, fecha_contratacion: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                value={formData.cargo}
                onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departamento">Departamento</Label>
              <Input
                id="departamento"
                value={formData.departamento}
                onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado del Empleado</Label>
              <Input
                id="estado"
                value={formData.estado}
                onChange={(e) => setFormData({...formData, estado: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Componente de confirmación de eliminación
const DeleteConfirmation = ({ isOpen, setIsOpen, onConfirm, employeeName }) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Eliminación</DialogTitle>
        </DialogHeader>
        <p>¿Está seguro que desea eliminar al empleado {employeeName}?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Eliminar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Componente principal de Empleados
const Employees = () => {
  const [employeesData, setEmployeesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  // Función para obtener los empleados de Firestore
  const fetchEmployees = async () => {
    try {
      const employeesCollection = collection(firestore, 'empleados');
      const employeesSnapshot = await getDocs(employeesCollection);
      const employeesList = employeesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEmployeesData(employeesList);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Función para agregar un nuevo empleado
  const handleAddEmployee = async (employeeData) => {
    try {
      const employeesCollection = collection(firestore, 'empleados');
      await addDoc(employeesCollection, employeeData);
      await fetchEmployees();
      showAlert('Empleado agregado exitosamente', 'success');
    } catch (err) {
      showAlert('Error al agregar empleado: ' + err.message, 'error');
    }
  };

  // Función para manejar el clic en eliminar
  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  // Función para confirmar la eliminación
  const handleDeleteConfirm = async () => {
    try {
      const employeeDoc = doc(firestore, 'empleados', selectedEmployee.id);
      await deleteDoc(employeeDoc);
      await fetchEmployees();
      setIsDeleteModalOpen(false);
      showAlert('Empleado eliminado exitosamente', 'success');
    } catch (err) {
      showAlert('Error al eliminar empleado: ' + err.message, 'error');
    }
  };

  // Función para mostrar alertas
  const showAlert = (message, type) => {
    setAlertMessage({ message, type });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  // Efecto para cargar los empleados al montar el componente
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Definición de columnas para la tabla
  const employeesColumns = useMemo(
    () => [
      {
        Header: 'Acciones',
        id: 'actions',
        Cell: ({ row }) => (
          <button
            onClick={() => handleDeleteClick(row.original)}
            className="x-button"
          >
            <X size={20} />
          </button>
        ),
      },
      {
        Header: 'Tipo de ID',
        accessor: 'tipo_documento_identidad',
      },
      {
        Header: 'ID',
        accessor: 'numero_documento_identidad',
      },
      {
        Header: 'Nombre(s)',
        accessor: 'primer_nombre',
      },
      {
        Header: 'Apellido(s)',
        accessor: 'primer_apellido',
      },
      {
        Header: 'Fecha de Nacimiento',
        accessor: 'fecha_nacimiento',
        Cell: ({ value }) => value?.seconds ? new Date(value.seconds * 1000).toLocaleDateString('es-CO') : '',
      },
      {
        Header: 'Edad',
        accessor: 'edad',
      },
      {
        Header: 'Ciudad',
        accessor: 'ciudad',
      },
      {
        Header: 'Email',
        accessor: 'correo',
      },
      {
        Header: 'Teléfono',
        accessor: 'telefono',
      },
      {
        Header: 'Fecha de Contratación',
        accessor: 'fecha_contratacion',
        Cell: ({ value }) => value?.seconds ? new Date(value.seconds * 1000).toLocaleDateString('es-CO') : '',
      },
      {
        Header: 'Cargo',
        accessor: 'cargo',
      },
      {
        Header: 'Departamento',
        accessor: 'departamento',
      },
      {
        Header: 'Estado del Empleado',
        accessor: 'estado_empleado',
      },
    ],
    []
  );

  // Configuración de la tabla con react-table
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { globalFilter },
  } = useTable(
    {
      columns: employeesColumns,
      data: employeesData,
    },
    useGlobalFilter
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando empleados...</div>;
  }

  if (error) {
    return <div className="text-red-600 p-4">Error al cargar los datos: {error}</div>;
  }

  return (
    <div className="p-4">
      <Header />
      <div className="mb-6">
        <br />
        <br />
        <br />
        <br />
        <div className="flex items-center justify-between mb-4">
          <EmployeesFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
            <br />
          </div>


          <div className='button-container'>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="add-employee-button"
          >
            Agregar Empleado
          </Button>
        </div>
        <br />
      </div>

      {alertMessage && (
        <Alert className={`mb-4 ${alertMessage.type === 'error' ? 'bg-red-100' : 'bg-green-100'}`}>
          <AlertTitle>{alertMessage.type === 'error' ? 'Error' : 'Éxito'}</AlertTitle>
          <AlertDescription>{alertMessage.message}</AlertDescription>
        </Alert>
      )}

      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps()}
                    className="px-6 py-3 text-left text-xs  font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap">
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        setIsOpen={setIsAddModalOpen}
        onAddEmployee={handleAddEmployee}
      />

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        employeeName={selectedEmployee?.primer_nombre}
      />
    </div>
  );
};

export default Employees;