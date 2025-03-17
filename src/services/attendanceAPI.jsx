import axios from 'axios';
import api from '../api/api';


// Log attendance in
export const logAttendanceIn = async (empCode, startTime) => {
  try {
    const response = await api.post(`${import.meta.env.VITE_BASE_URL}/attendance/login`, {
      emp_code: empCode,
      start_time: startTime,
    }, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
  }
};

// Log attendance out
export const logAttendanceOut = async (empCode, endTime) => {
  try {
    const response = await api.post(`${API_URL}/attendance/logout`, {
      emp_code: empCode,
      end_time: endTime,
    }, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
  }
};