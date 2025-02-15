import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Access authentication context
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { Add, PlusOne } from '@mui/icons-material';
import styles from './styles/Employees.module.css';
import axios from 'axios';

const Designations = () => {
    const { user, logout } = useAuth(); // Get user and logout function from AuthContext
    const navigate = useNavigate();

    const [designations, setDesignations] = useState([]);

    useEffect(() => {
        const fetchDessignations = async () => {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/designations/`);
            setDesignations(response.data);
        };

        fetchDessignations();
    }, []);

    const handleDelete = async (designation_id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/admin/designations/${designation_id}`);
            setEmployees(designations.filter((d) => d.id !== designation_id));
        } catch (error) {
            console.error('Error deleting designation:', error);
        }
    };

    return (
        <div className={styles.container}>
            <ul>
                {designations.map((desg) => (
                    <li key={desg.id}>
                        {desg.name}
                        <button onClick={() => handleDelete(desg.id)}>Delete</button>
                        <button onClick={() => { }}>Edit</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Designations;
