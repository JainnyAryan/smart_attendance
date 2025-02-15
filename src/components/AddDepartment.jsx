import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField } from '@mui/material';
import { BadgeOutlined, Domain, Person } from '@mui/icons-material';
import { IconClock } from '@tabler/icons-react';
import { v4 as uuidv4 } from 'uuid';
import { toast, ToastContainer } from 'react-toastify';

const AddDepartment = ({ isOpen, setIsOpen }) => {
    const [formData, setFormData] = useState({
        name: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedData = {
            name: formData.name,
        };

        setIsLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/admin/departments/`, formattedData);
            toast.success(`Succesfully added department : ${formattedData.name}`);
        } catch (error) {
            toast.error(`Error adding department: ${error}`);
            console.error('Error adding department:', error);
        }
        finally {
            setIsOpen(false);
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={() => { setIsOpen(false); }} fullWidth>
            <DialogTitle>{"New Department"}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <Container display={'flex'} flexDirection={'column'} justifyContent={'space-between'} style={{ paddingTop: "10px" }}>
                        <TextField
                            type="text"
                            name="name"
                            label="Department Name"
                            value={formData.name}
                            onChange={handleChange}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Domain />
                                        </InputAdornment>
                                    )
                                }
                            }}
                            fullWidth
                            required
                        />
                    </Container>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { setIsOpen(false); }} disabled={isLoading}>
                    Cancel
                </Button>
                <Button color="success" onClick={handleSubmit} disabled={isLoading}>
                    Add Department
                </Button>
            </DialogActions>
        </Dialog>

    );
};

export default AddDepartment;