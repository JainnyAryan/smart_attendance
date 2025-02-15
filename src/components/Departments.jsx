import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Access authentication context
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { Add, PlusOne } from '@mui/icons-material';
import styles from './styles/Employees.module.css';
import axios from 'axios';

const Departments = () => {
    const { user, logout } = useAuth(); // Get user and logout function from AuthContext
    const navigate = useNavigate();

    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/departments/`);
            setDepartments(response.data);
        };

        fetchEmployees();
    }, []);

    const handleDelete = async (deptId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/departments/${empCode}`);
            setDepartments(departments.filter((dept) => dept.id !== deptId));  // Remove deleted employee from the list
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };



    return (
        <div className={styles.container}>
            <ul>
                {departments.map((dept) => (
                    <li key={dept.id}>
                        {dept.name}
                        <button onClick={() => handleDelete(employee.emp_code)}>Delete</button>
                        <button onClick={() => {}}>Edit</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Departments;
