import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import csvDownload from 'json-to-csv-export'
import axios from 'axios';
import moment from 'moment';
import Swal from 'sweetalert2';
import { Button } from '@mui/material';

export default function ViewEmployees () {
    const navigate = useNavigate();
    // State for employees data
    const [rows, setRows] = useState([]);

    //Columns
    const columns = [
      { field: 'id', headerName: 'ID', width: 70 },
      { field: 'employeeName', headerName: 'Name', width: 130 },
      { field: 'mobileNumber', headerName: 'Mobile Number', width: 130 },
      { field: 'email', headerName: 'Email', width: 130 },
      { field: 'dob', headerName: 'DOB', width: 130 },
      { field: 'department', headerName: 'Department', width: 130 },
      { field: 'designation', headerName: 'Designation', width: 130 },
      { field: 'gender', headerName: 'Gender', width: 130 },
      { field: 'bloodGroup', headerName: 'Blood Group', width: 130 },
      { field: 'address', headerName: 'Address', width: 130 },
      {
        field: 'action',
        headerName: 'Action',
        width: 130,
        renderCell: (params) => (
          <div>
            <IconButton onClick={() => handleEdit(params.row.id)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </div>
        )
      },
    ];

    // Fetch all employee data
    const fetchEmployeeData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/employees');
            console.log(response);
            const formattedRows = response.data.map((employee) => ({
                id: employee._id,
                employeeName: employee.employeeName,
                mobileNumber: employee.mobileNumber,
                email: employee.email,
                dob: moment(employee.dob).format('YYYY-MM-DD'),
                department: employee.department,
                designation: employee.designation,
                gender: employee.gender,
                bloodGroup: employee.bloodGroup,
                address: employee.address,
            }));
            formattedRows.sort((a, b) => b.id.localeCompare(a.id));
            setRows(formattedRows);
        } catch (error) {
            console.error("Error fetching employee data:", error);
        }
    };

    useEffect(() => {
      fetchEmployeeData();
    }, []);
       
    // Function to be executed when clicked on UPDATE button
    const handleEdit = (id) => {
        console.log(`Edit button clicked for ID: ${id}`);
        navigate(`/employee/edit/${id}`);
    };

    // Function to be executed when clicked on DELETE button
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Once deleted, you will not be able to recover this record!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                // Delete the record if user clicks "Yes"
                deleteRecord(id);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'Record not deleted', 'info');
            }
        });
    };

    const deleteRecord = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/employees/${id}`);
            fetchEmployeeData();
            Swal.fire('Deleted!', 'Record has been deleted.', 'success');
        } catch (error) {
            console.error("Error deleting employee:", error);
            Swal.fire('Error!', 'There was an error deleting the record.', 'error');
        }
    };

    // Function to be executed when clicked on EXPORT TO CSV button
    const dataToConvert = {
      data: rows,
      filename: 'employee_data',
      delimiter: ',',
      headers: ['ID', "Employee Name", "Mobile Number", "Email", "DOB", "Department", "Designation", "Gender", "Blood Group", "Address"]
    }
    

    return(
        <div className='container p-0'>
            <div className='row form-container m-0'>
                <div className="col-*-12 form-title d-flex justify-content-between">
                    <h2>Employee Details</h2>
                    <Button variant="contained" size="large" type='button' color="secondary" onClick={()=>csvDownload(dataToConvert)}>Export as CSV</Button>
                </div>

                <div className="col-12 mb-4">
                    <div>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{
                              pagination: {
                                  paginationModel: { page: 0, pageSize: 10 },
                              },
                            }}
                            pageSizeOptions={[5, 10, 15, 20]}
                            checkboxSelection={false}
                            autoHeight
                            autoWidth 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}