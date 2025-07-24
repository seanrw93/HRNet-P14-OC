import { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router';
import { reformatCamelCase } from '../utils/reformatCamelCase';
import { updateEmployee, deleteEmployee } from '../store/employeeSlice';
import { states } from "../data/states"
import { departments } from '../data/departments'

import EmployeeDataTableRow from '../components/EmployeeDataTableRow';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import Loader from '../components/Loader';

const Table = lazy(() => import('react-bootstrap/Table'));


const EmployeesListPage = () => {
  const dispatch = useDispatch();
  const savedEmployees = useSelector((state) => state.employees.employee);
  const keys = savedEmployees.length > 0 ? Object.keys(savedEmployees[0]) : [];

  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [error, setError] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesToShow, setEntriesToShow] = useState("10");

  const invalidFields = [];


  useEffect(() => {
    localStorage.setItem("employeeList", JSON.stringify(savedEmployees));
  }, [savedEmployees]);


  const editMode = useCallback((element) => {
    setEditId(element.id);
    setEditValues(element);
  }, []);

  const handleEditSave = useCallback(() => {
    for (const key in editValues) {
      if (editValues[key].trim() === "" || editValues[key] === null) {
        invalidFields.push(key);
      }
    };

    if (invalidFields.length > 0) {
      setError(invalidFields);
      console.log(error);
      return;
    };

    setError([])

    if (window.confirm("Update employee details?")) {
      dispatch(updateEmployee(editValues));
      setEditId(null);
    }
  }, [dispatch, editValues]);

  const handleEditChange = useCallback((e) => {
    const {name, value} = e.target;

    if (value.trim() !== "") {
      setError(prev => prev.filter(field => field !== name));
    }

    setEditValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, [setEditValues, setError]);

  const handleDelete = useCallback((id) => {
    if (window.confirm("Delete this employee from database?")) {
      dispatch(deleteEmployee(id));
    }
  }, [dispatch]);

  // Memoized filtered employees based on search query
  // This will only recompute when savedEmployees or searchQuery changes
  const filteredEmployees = useMemo(() =>
    savedEmployees.filter(employee =>
      Object.values(employee).some(value =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    ),
    [savedEmployees, searchQuery]
  );

  const statesOptions = states.map(state => (
                        <option key={state.abbreviation} value={state.abbreviation}>{state.name}</option>
                      ));

  const departmentsOptions = departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                              ));

  return (
    <Container fluid className="my-4">
      <Row>
        <Col lg={10} className="mx-auto">
          <div className="title mb-4 text-center">
              <h1>View Current Employees</h1>
          </div>
          <Row className="mb-3">
            <Col xs="auto">
              <Form.Select
                value={entriesToShow}
              >
              </Form.Select>
            </Col>
            <Col>
              <Form.Control
                type="text"
                className="max-w-300"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Search employee data"
                disabled={savedEmployees.length === 0}
              />
            </Col>
          </Row>
          {filteredEmployees.length > 0 ? (
              <Suspense fallback={<Loader />}>
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
                    {filteredEmployees.map((employee) => (
                      <EmployeeDataTableRow
                        key={employee.id}
                        employee={employee}
                        editId={editId}
                        keys={keys}
                        editValues={editValues}
                        handleEditChange={handleEditChange}
                        error={error}
                        departmentsOptions={departmentsOptions}
                        statesOptions={statesOptions}
                        handleEditSave={handleEditSave}
                        setEditId={setEditId}
                        editMode={editMode}
                        handleDelete={handleDelete}
                      />
                    ))}
                  </tbody>
                </Table>
                <p className="text-left">
                  Showing 1 to {filteredEmployees.length} of {filteredEmployees.length} entries
                </p>
              </Suspense>
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