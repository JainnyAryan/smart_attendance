import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
  const [name, setName] = useState('');
  const [shiftCode, setShiftCode] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const employeeData = { name, shift_code: shiftCode, dept_code: deptCode };

    try {
      await axios.post('http://localhost:8000/api/admin/employees/', employeeData);
      navigate('/admin-dashboard');  // Redirect to admin dashboard after successful creation
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  return (
    <div>
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Employee Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Shift Code"
          value={shiftCode}
          onChange={(e) => setShiftCode(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Department Code"
          value={deptCode}
          onChange={(e) => setDeptCode(e.target.value)}
          required
        />
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployee;