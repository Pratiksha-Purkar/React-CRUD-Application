import React from 'react';
import { Formik, Form } from 'formik';
import { TextField, Button, InputLabel, MenuItem, FormControl, Select, Radio, RadioGroup, FormControlLabel, FormLabel, FormHelperText } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import './AddEmployee.css';

export default function AddEmployee() {
    const navigate = useNavigate();

    // Array of values for data population for department
    const departments = [
        { label: 'IT' },
        { label: 'Accounts' },
        { label: 'Sales' },
        { label: 'Marketing' }
    ];

    // Array of values for data population for blood group
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

    // Function to be executed when clicked on ADD button
    const onAddEmployee = async (values) => {
        console.log("Form Submitted!");
        console.log(values);
        try {
            const response = await axios.post('http://localhost:5000/api/employees', values);
            console.log("Form Submitted!");

            Swal.fire({
                title: 'Employee Details Added!<br>Add another one?',
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire('Great!', 'You chose to add another employee!', 'success');
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    navigate(`/employee/view`);
                }
            });
        } catch (error) {
            console.error("Error while adding employee:", error);
        }
    }

    // Function to be executed when clicked on CLEAR button
    const onClear = (resetForm) => {
        console.log("Clear Clicked!");
        resetForm();
    }

    // Function to be executed when clicked on CANCEL button
    const onCancel = () => {
        console.log("Cancel Clicked!");
        navigate(`/`);
    }

    return (
        // Form using Formik
        <div className='container p-0'>
            <Formik
                initialValues={{
                    employeeName: '',
                    dob: '',
                    email: '',
                    mobileNumber: '',
                    department: '',
                    designation: '',
                    gender: '',
                    bloodGroup: '',
                    address: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                    onAddEmployee(values);
                    resetForm();
                }}
            >
                {({ values, handleChange, handleSubmit, errors, touched, resetForm }) => (
                    <Form onSubmit={handleSubmit}>
                        <div className='row form-container m-0'>
                            {/* Form Title */}
                            <div className='col-*-12 form-title'>
                                <h2>Add Employee Details</h2>
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
                                    <FormLabel id="gender">Gender  *</FormLabel>
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
                            <div className='col-*-12 text-center'>
                                <Button className='m-3 btn-form-action' variant="contained" size="large" type='button' color="warning" onClick={() => onClear(resetForm)}>Clear</Button>
                                <Button className='m-3 btn-form-action' variant="contained" size="large" type='submit'>Add</Button>
                                <Button className='m-3 btn-form-action' variant="contained" size="large" type='button' color="error" onClick={onCancel}>Cancel</Button>
                            </div>

                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
