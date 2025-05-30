import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { reformatCamelCase } from '../utils/reformatCamelCase';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert'


const EmployeesListPage = () => {
  const employees = useSelector((state) => state.employees.employee);
  const keys = employees.length > 0 ? Object.keys(employees[0]) : [];

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
                        <th key={key}>{reformatCamelCase(key)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee, index) => (
                      <tr key={index}>
                        {keys.map((key) => (
                          <td key={key}>{employee[key]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <p class="text-left">
                  Showing {employees.length} / {employees.length} results
                </p>
              </>
            ) : (
              <Alert variant="danger" className="text-center my-5">No employee data found</Alert>
          )}
          <div class="text-center">
            <Link to="/">Home</Link>
          </div>
        </Col>
      </Row>
    </Container>
    
  )
}

export default EmployeesListPage;