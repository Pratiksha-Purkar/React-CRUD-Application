import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { TextField, Button, InputLabel, MenuItem, FormControl, Select, Radio, RadioGroup, FormControlLabel, FormLabel, FormHelperText, CircularProgress  } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import Swal from 'sweetalert2';

import './EditEmployee.css';

export default function EditEmployee() {
    //Getting ID from URL passed as /:id
    const { id } = useParams();
    const navigate = useNavigate();

    // Array of values for data population of Department
    const departments = [
        { label: 'IT' },
        { label: 'Accounts' },
        { label: 'Sales' },
        { label: 'Marketing' }
    ];

    // Array of values for data population of Blood Group
    const bloodGroups = ['A+', 'B+', 'AB+', 'A-', 'B-', 'AB-', 'O+', 'O-'];

    // Validation schema
    const validationSchema = Yup.object().shape({
        employeeName: Yup.string().required('Name is required'),
        dob: Yup.string().required('Date of Birth is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        mobileNumber: Yup.string()
            .matches(/^[0-9]+$/, 'Must be only digits')
            .length(10, 'Mobile No must be exactly 10 digits')
            .required('Mobile No is required'),
        department: Yup.string().required('Department is required'),
        designation: Yup.string().required('Designation is required'),
        gender: Yup.string().required('Gender is required'),
        bloodGroup: Yup.string().required('Blood Group is required'),
        address: Yup.string().required('Address is required'),
    });

    // Initialize state for form values
    const [initialValues, setInitialValues] = useState(null);
    // State for Loading
    const [loading, setLoading] = useState(true);

    // Function to fetch employee data by ID
    const fetchEmployeeData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/employees/${id}`);
            const employeeData = response.data; // Assuming the API returns employee data object
            // Set initial form values with employee data
            console.log(employeeData);
            const formattedDOB = moment(employeeData.dob).format('YYYY-MM-DD');
            setInitialValues({
                employeeName: employeeData.employeeName,
                dob: formattedDOB,
                email: employeeData.email,
                mobileNumber: employeeData.mobileNumber,
                department: employeeData.department,
                designation: employeeData.designation,
                gender: employeeData.gender,
                bloodGroup: employeeData.bloodGroup,
                address: employeeData.address,
            });
            console.log(initialValues);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    useEffect(() => {
        // Fetch employee data when component mounts
        fetchEmployeeData();
    }, [id]); // Fetch data whenever the ID parameter changes


    // Function to be executed when clicked on ADD button
    const onUpdateEmployee = async (values) => {
        console.log("Form Submitted!");
        console.log(values);
        
        try {
            // Make PUT request to update employee data
            await axios.put(`http://localhost:5000/api/employees/${id}`, values);
            Swal.fire({
                title: 'Details Updated!',
                text: 'Employee details have been successfully updated.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                // Navigate to another route or perform other actions after user clicks "OK"
                navigate('/employee/view');
            });
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    }

    // Function to be executed when clicked on CANCEL button
    const onCancel = () => {
        console.log("Cancel Clicked!");
        navigate(`/employee/view`);
    }

    // If Loading is true the show loading icon
    if (loading) {
        return <CircularProgress />; // Show loading indicator while data is being fetched
    }

    return (
        // Form using Formik
        <div className='container p-0'>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                    onUpdateEmployee(values);
                    resetForm();
                }}
            >
                {({ values, handleChange, handleSubmit, errors, touched, resetForm }) => (
                    <Form onSubmit={handleSubmit}>
                        <div className='row form-container m-0'>
                            {/* Form Title */}
                            <div className='col-*-12 form-title'>
                                <h2>Edit Employee Details</h2>
                            </div>

                            {/* Employee Name */}
                            <div className='col-lg-4 col-md-6 col-sm-12 form-field'>
                                <TextField
                                    id="employeeName"
                                    label="Employee Name *"
                                    variant="standard"
                                    className='w-100'
                                    onChange={handleChange}
                                    value={values.employeeName}
                                    error={touched.employeeName && !!errors.employeeName}
                                    helperText={touched.employeeName && errors.employeeName}
                                />
                            </div>


                            {/* Employee Date of Birth */}
                            <div className='col-lg-4 col-md-6 col-sm-12 form-field'>
                                <TextField
                                    name="dob"
                                    label="Date of Birth *"
                                    variant="standard"
                                    type="date"
                                    value={values.dob}
                                    onChange={handleChange}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    error={touched.dob && !!errors.dob}
                                    helperText={touched.dob && errors.dob}
                                />
                            </div>

                            {/* Employee Email */}
                            <div className='col-lg-4 col-md-6 col-sm-12 form-field'>
                                <TextField
                                    id="email"
                                    type='email'
                                    label="Email *"
                                    variant="standard"
                                    className='w-100'
                                    onChange={handleChange}
                                    value={values.email}
                                    error={touched.email && !!errors.email}
                                    helperText={touched.email && errors.email}
                                />
                            </div>

                            {/* Employee Mobile Number */}
                            <div className='col-lg-4 col-md-6 col-sm-12 form-field'>
                                <TextField
                                    id="mobileNumber"
                                    label="Mobile No *"
                                    variant="standard"
                                    className='w-100'
                                    onChange={handleChange}
                                    value={values.mobileNumber}
                                    error={touched.mobileNumber && !!errors.mobileNumber}
                                    helperText={touched.mobileNumber && errors.mobileNumber}
                                />
                            </div>

                            {/* Employee Department - Searchable dropdown */}
                            <div className='col-lg-4 col-md-6 col-sm-12 form-field'>
                                <Autocomplete
                                    className='w-100'
                                    disablePortal
                                    id="combo-box-demo"
                                    options={departments}
                                    sx={{ width: 300 }}
                                    value={values.department}
                                    onChange={(event, value) => handleChange({ target: { name: 'department', value: value ? value.label : '' } })}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Department *"
                                            variant="standard"
                                            error={touched.department && !!errors.department}
                                            helperText={touched.department && errors.department}
                                        />
                                    )}
                                    
                                />
                            </div>

                            {/* Employee Designation */}
                            <div className='col-lg-4 col-md-6 col-sm-12 form-field'>
                                <TextField
                                    id="designation"
                                    label="Designation *"
                                    variant="standard"
                                    className='w-100'
                                    onChange={handleChange}
                                    value={values.designation}
                                    error={touched.designation && !!errors.designation}
                                    helperText={touched.designation && errors.designation}
                                />
                            </div>

                            {/* Employee Blood Group Dropdown */}
                            <div className='col-lg-4 col-md-6 col-sm-12 form-field'>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel id="bloodGroup">Blood Group *</InputLabel>
                                    <Select
                                        labelId="bloodGroup"
                                        id="bloodGroup"
                                        value={values.bloodGroup}
                                        label="Blood Group"
                                        onChange={handleChange}
                                        name="bloodGroup"
                                        error={touched.bloodGroup && !!errors.bloodGroup}
                                        helperText={touched.bloodGroup && errors.bloodGroup}
                                    >
                                        {bloodGroups.map((group) => (
                                            <MenuItem key={group} value={group}>{group}</MenuItem>
                                        ))}
                                        
                                    </Select>
                                </FormControl>
                            </div>

                            {/* Employee Gender - Radio Button */}
                            <div className='col-lg-4 col-md-6 col-sm-12 form-field px-4'>
                                <FormControl>
                                    <FormLabel id="gender">Gender *</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        name="gender"
                                        value={values.gender}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                        <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                        <FormControlLabel value="Other" control={<Radio />} label="Other" />
                                    </RadioGroup>
                                    {touched.gender && errors.gender && (
                                        <FormHelperText error>{errors.gender}</FormHelperText>
                                    )}
                                </FormControl>
                            </div>

                            {/* Employee Address */}
                            <div className='col-lg-4 col-md-6 col-sm-12 form-field'>
                                <TextField
                                    id="address"
                                    multiline
                                    rows={4}
                                    maxRows={5}
                                    label="Address *"
                                    variant="standard"
                                    className='w-100'
                                    onChange={handleChange}
                                    value={values.address}
                                    error={touched.address && !!errors.address}
                                    helperText={touched.address && errors.address}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className='col-12 text-center'>
                                <Button className="btn-form-action mx-3" variant="contained" size="large" type='submit'>Update</Button>
                                <Button className="btn-form-action mx-3" variant="contained" size="large" type='button' color="error" onClick={onCancel}>Cancel</Button>
                            </div>

                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
