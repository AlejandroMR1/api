import React, { useState, useMemo } from 'react';
import "./Employees.css"
import { useTable, useGlobalFilter, useAsyncDebounce } from 'react-table';
import 'regenerator-runtime/runtime';
import { users } from './dataUsers';
import Header from './Header';

// Componente para el buscador (filtro global)
function EmployeesFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) {
  const totalEmployees = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);

  const onFilterChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  const handleInputChange = (e) => {
    setValue(e.target.value);
    onFilterChange(e.target.value);
  };

  return (
    <span className="employees-filter">
      Buscador global: 
      <input
        size={50}
        value={value || ""}
        onChange={handleInputChange}
        placeholder={`${totalEmployees} empleados`}
      />
    </span>
  );
}

const Employees = () => {
  // Definir las columnas para la tabla
  const columns = useMemo(
    () => [
      {
        Header: 'Tipo de ID',
        accessor: 'id_type',
      },
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Nombre(s)',
        accessor: 'name',
      },
      {
        Header: 'Apellido(s)',
        accessor: 'last_name',
      },
      {
        Header: 'Fecha de Nacimiento',
        accessor: 'birthdate',
      },
      {
        Header: 'Edad',
        accessor: 'age',
      },
      {
        Header: 'Ciudad',
        accessor: 'city',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Teléfono',
        accessor: 'phone',
      },
      {
        Header: 'Fecha de Contratación',
        accessor: 'hiring_date',
      },
      {
        Header: 'Cargo',
        accessor: 'post',
      },
      {
        Header: 'Departamento',
        accessor: 'department',
      },

    ],
    []
  );

  // Datos de ejemplo
  const data = useMemo(
    () => users.map(user => ({
      id_type: `${user.id_type}`,
      id: `${user.id}`,
      name: `${user.name} `,
      last_name: `${user.last_name}`, 
      birthdate: `${user.birthdate}`,
      age: `${user.age}`,
      city: `${user.city}`,
      email: `${user.email}`,
      phone: `${user.phone}`,
      hiring_date: `${user.hiring_date}`,
      post: `${user.post}`,
      department: user.department,

    })),
    [users]
  );
  

  // Usar el hook useTable para definir la estructura de la tabla y aplicar el filtro
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { globalFilter },
  } = useTable({ columns, data }, useGlobalFilter);

  return (
    <div>
      <Header/>
      <h1>Tabla de Empleados</h1>

      {/* Componente de filtro (buscador) */}
      <EmployeesFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />

      {/* Renderizado de la tabla */}
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
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
