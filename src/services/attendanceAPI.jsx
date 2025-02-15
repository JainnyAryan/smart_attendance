import axios from 'axios';


// Log attendance in
export const logAttendanceIn = async (empCode, startTime) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/attendance/login`, {
      emp_code: empCode,
      start_time: startTime,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
  }
};

// Log attendance out
export const logAttendanceOut = async (empCode, endTime) => {
  try {
    const response = await axios.post(`${API_URL}/attendance/logout`, {
      emp_code: empCode,
      end_time: endTime,
    });
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
  }
};