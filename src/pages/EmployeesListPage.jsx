import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router';
import { reformatCamelCase } from '../utils/reformatCamelCase';
import { updateEmployee, deleteEmployee } from '../store/employeeSlice';
import { states } from "../data/states"
import { departments } from '../data/departments'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert'
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button'



const EmployeesListPage = () => {
  const dispatch = useDispatch();
  const savedEmployees = useSelector((state) => state.employees.employee);
  const keys = savedEmployees.length > 0 ? Object.keys(savedEmployees[0]) : [];

  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [error, setError] = useState([])



  useEffect(() => {
    localStorage.setItem("employeeList", JSON.stringify(savedEmployees))
  }, [savedEmployees]);


  const editMode = (element) => {
    setEditId(element.id);
    setEditValues(element);
  }

  const invalidFields = [];

  const handleEditSave = () => {
    for (const key in editValues) {
      if (editValues[key].trim() === "" || editValues[key] === null) {
        invalidFields.push(key)
      }
    }

    if (invalidFields.length > 0) {
      setError(invalidFields);
      console.log(error)
      return;
    }

    setError([])

    if (window.confirm("Update employee details?")) {
      dispatch(updateEmployee(editValues));
      setEditId(null);
    }
  }

  const handleEditChange = (e) => {
    const {name, value} = e.target;

    if (value.trim() !== "") {
      setError(prev => prev.filter(field => field !== name));
    }

 

    setEditValues(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleDelete = (id) => {
    if (window.confirm("Delete this employee from database?")) {
      dispatch(deleteEmployee(id));
    }
  }

  const statesOptions = states.map(state => (
                        <option key={state.abbreviation} value={state.abbreviation}>{state.name}</option>
                      ))

  const departmentsOptions = departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                              ))


  const employeeDataTableRow = (
    savedEmployees.map((employee) => (
      editId === employee.id ? (
        <tr key={employee.id} id={employee.id}>
          {keys.map((key) =>
            key !== "id" ? (
              <td key={key}>
                {key === "department" || key === "state" ? (
                  <Form.Select
                    name={key}
                    value={editValues[key] || ""}
                    onChange={handleEditChange}  
                  >
                    {key === "department" ? departmentsOptions : statesOptions}
                  </Form.Select>
                ) : (
                  <Form.Control
                    type={key === "zipCode" ? "number" : "text"}
                    name={key}
                    value={editValues[key] || ""}
                    onChange={handleEditChange}
                    isInvalid={error.includes(key)}
                  />
                )}
              </td>
            ) : null
          )}
          <td className="text-center">
            <ButtonGroup>
              <Button type="button" variant="secondary" onClick={handleEditSave}>Change</Button>
              <Button type="button" variant="dark" onClick={() => setEditId(null)}>Cancel</Button>
            </ButtonGroup>
          </td>
        </tr>
      ) : (
        <tr key={employee.id} id={employee.id}>
          {keys.map((key) => (
            key !== "id" && <td key={key}>{typeof employee[key] === "object" ? JSON.stringify(employee[key]) : employee[key]}</td>
          ))}
          <td className="text-center">
            <ButtonGroup>
              <Button type="button" variant="primary" onClick={() => editMode(employee)}>Edit</Button>
              <Button type="button" variant="danger" onClick={() => handleDelete(employee.id)}>Delete</Button>
            </ButtonGroup>
          </td>
        </tr>
      )
    ))
  );

  return (
    <Container fluid className="my-4">
      <Row>
        <Col lg={10} className="mx-auto">
          <div className="title mb-4 text-center">
              <h1>View Current Employees</h1>
          </div>
          {savedEmployees.length > 0 ? (
              <>
                <Table id="employee-table" responsive bordered striped>
                  <thead>
                    <tr>
                      {keys.map((key) => (
                        key !== "id" && <th key={key}>{reformatCamelCase(key)}</th>
                      ))}
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeDataTableRow}
                  </tbody>
                </Table>
                <p className="text-left">
                  Showing 1 to {savedEmployees.length} of {savedEmployees.length} entries
                </p>
              </>
            ) : (
              <Alert variant="danger" className="text-center my-5">No employee data found</Alert>
          )}
          <div className="text-center">
            <Link to="/">Home</Link>
          </div>
        </Col>
      </Row>
    </Container>
    
  )
}

export default EmployeesListPage;