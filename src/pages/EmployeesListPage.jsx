import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router';
import { reformatCamelCase } from '../utils/reformatCamelCase';
import { deleteEmployee } from '../store/employeeSlice';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert'
import { ButtonGroup } from 'react-bootstrap/';
import Button from 'react-bootstrap/Button'



const EmployeesListPage = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.employee);
  const keys = employees.length > 0 ? Object.keys(employees[0]) : [];

  useEffect(() => {
    localStorage.setItem("employeeList", JSON.stringify(employees))
  }, [employees])

  const handleDelete = (id) => {
    if (window.confirm("Delete this employee from database?")) {
      dispatch(deleteEmployee(id))
    }
  }

  return (
    <Container fluid className="my-4">
      <Row>
        <Col lg={10} className="mx-auto">
          <div className="title mb-4 text-center">
              <h1>View Current Employees</h1>
          </div>
          {employees.length > 0 ? (
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
                    {employees.map((employee, index) => (
                      <tr key={index} id={employee.id}>
                        {keys.map((key) => (
                          key !== "id" && <td key={key}>{employee[key]}</td>
                        ))}
                        <td>
                          <ButtonGroup>
                            <Button variant="primary">Edit</Button>
                            <Button variant="danger" onClick={() => handleDelete(employee.id)}>Delete</Button>
                          </ButtonGroup>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <p className="text-left">
                  Showing 1 to {employees.length} of {employees.length} entries
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