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

    const [shifts, setShifts] = useState([]);

    useEffect(() => {
        const fetchShifts = async () => {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/shifts/`);
            setShifts(response.data);
        };

        fetchShifts();
    }, []);

    const handleDelete = async (sId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/shifts/${sId}`);
            setShifts(shifts.filter((s) => s.id !== sId));  
        } catch (error) {
            console.error('Error deleting shift:', error);
        }
    };



    return (
        <div className={styles.container}>
            <ul>
                {shifts.map((s) => (
                    <li key={s.id}>
                        {s.name} - {s.start_time} - {s.end_time}
                        <button onClick={() => handleDelete(s.id)}>Delete</button>
                        <button onClick={() => {}}>Edit</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Departments;
