import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './styles/Employees.module.css';

const Employees = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const employeesRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/employees/`);
                console.log(employeesRes);
                setEmployees(employeesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (empId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/employees/${empId}`);
            setEmployees(employees.filter((emp) => emp.id !== empId));
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    return (
        <div className={styles.container}>
            <ul>
                {employees.map((employee) => (
                    <li key={employee.id}>
                        {employee.name} - {employee.shift_code} - {employee.dept_code}
                        <button onClick={() => handleDelete(employee.id)}>Delete</button>
                        <button onClick={() => { }}>Edit</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Employees;