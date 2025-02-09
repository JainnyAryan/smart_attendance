import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch employees from the backend
    const fetchEmployees = async () => {
      const response = await axios.get('http://localhost:8000/api/admin/employees/');
      setEmployees(response.data);
    };

    fetchEmployees();
  }, []);

  const handleDelete = async (empCode) => {
    try {
      await axios.delete(`http://localhost:8000/api/admin/employees/${empCode}`);
      setEmployees(employees.filter((emp) => emp.emp_code !== empCode));  // Remove deleted employee from the list
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={() => navigate('/add-employee')}>Add Employee</button>
      <ul>
        {employees.map((employee) => (
          <li key={employee.emp_code}>
            {employee.name} - {employee.shift_code} - {employee.dept_code}
            <button onClick={() => handleDelete(employee.emp_code)}>Delete</button>
            <button onClick={() => navigate(`/edit-employee/${employee.emp_code}`)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;