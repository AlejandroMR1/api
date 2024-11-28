import React, { useState } from 'react';
import "./Attendance.css"
import Header from "./Header"
import { users } from './dataUsers';
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { TiTimes } from "react-icons/ti";
import { MdOutlineWatchLater } from "react-icons/md";

function AttendanceTable() {
    const [attendanceData, setAttendanceData] = useState(
        users.map(user => ({
            id_type: user.id_type,
            id: user.id,
            name: user.name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            post: user.post,
            department: user.department,
            date: new Date().toLocaleDateString('es-CO'),
            attendance: ""
        }))

    );

    const handleAttendanceChange = (index, value) => {
        const newData = [...attendanceData];
        newData[index].attendance = value;
        setAttendanceData(newData);
    };

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
                    {attendanceData.map((row, index) => (
                        <tr key={row.id}>
                            <td>{row.name}</td>
                            <td>{row.last_name}</td>
                            <td>{row.email}</td>
                            <td>{row.phone}</td>
                            <td>{row.post}</td>
                            <td>{row.department}</td>
                            <td>{row.date}</td>
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

export default AttendanceTable; 