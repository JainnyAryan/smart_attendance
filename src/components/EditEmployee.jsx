import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditEmployee = () => {
  const [name, setName] = useState('');
  const [shiftCode, setShiftCode] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const { empCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      const response = await axios.get(`http://localhost:8000/api/admin/employees/${empCode}`);
      const employee = response.data;
      setName(employee.name);
      setShiftCode(employee.shift_code);
      setDeptCode(employee.dept_code);
    };

    fetchEmployee();
  }, [empCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const employeeData = { name, shift_code: shiftCode, dept_code: deptCode };

    try {
      await axios.put(`http://localhost:8000/api/admin/employees/${empCode}`, employeeData);
      navigate('/admin-dashboard');  // Redirect after successful edit
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  return (
    <div>
      <h2>Edit Employee</h2>
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
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditEmployee;