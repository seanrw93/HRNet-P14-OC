import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { reformatCamelCase } from '../utils/reformatCamelCase';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';


const EmployeesListPage = () => {
  const employees = useSelector((state) => state.employee.employees);
  const keys = employees.length > 0 ? Object.keys(employees[0]) : [];
  
  return (
    <Container fluid className="my-4">
      <Row>
        <Col lg={10} className="mx-auto text-center">
          <div className="title mb-4">
              <h1>View Current Employees</h1>
          </div>
          <Table id="employee-table" responsive striped>
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
          <Link to="/">Home</Link>
        </Col>
      </Row>
    </Container>
    
  )
}

export default EmployeesListPage;