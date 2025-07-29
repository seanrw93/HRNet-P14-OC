import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
  lazy,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router";
import { updateEmployee, deleteEmployee } from "../store/employeeSlice";
import { states } from "../data/states";
import { departments } from "../data/departments";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Loader from "../components/Loader";

const EmployeeTable = lazy(() => import("../components/EmployeeTable"));

const EmployeesListPage = () => {
  const dispatch = useDispatch();
  const savedEmployees = useSelector((state) => state.employees.employee);
  const keys = savedEmployees.length > 0 ? Object.keys(savedEmployees[0]) : [];

  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [error, setError] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesToShow, setEntriesToShow] = useState(
    savedEmployees.length || "10"
  );
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  // Save employee data to localStorage whenever it changes
  // Simulate API call to patch endpoint
  // To update when backend is implemented
  useEffect(() => {
    localStorage.setItem("employeeList", JSON.stringify(savedEmployees));
  }, [savedEmployees]);

  const enterEditMode = useCallback((element) => {
    setError([]);
    setEditId(element.id);
    setEditValues(element);
  }, []);

  const handleEditValidation = () => {
    const invalidFields = [];
    for (const key in editValues) {
      const invalidValues = [
        editValues[key].trim() === "",
        editValues[key] === null,
        (key === "startDate" || key === "dateOfBirth") &&
          (!editValues[key] ||
            isNaN(Date.parse(editValues[key])) ||
            !editValues[key].match(/^\d{4}-\d{2}-\d{2}$/) ||
            new Date(editValues[key]) > new Date()),
      ];

      if (invalidValues.some(Boolean)) {
        invalidFields.push(key);
      }
    }
    return invalidFields;
  };

  const handleEditSave = useCallback(() => {
    const invalidFields = handleEditValidation();
    if (invalidFields.length > 0) {
      setError(invalidFields);
      console.error("Invalid fields:", invalidFields);
      return;
    }
    setError([]);
    if (window.confirm("Update employee details?")) {
      dispatch(updateEmployee(editValues));
      setEditId(null);
    }
  }, [dispatch, editValues]);

  const handleEditChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      if (value.trim() !== "") {
        setError((prev) => prev.filter((field) => field !== name));
      }

      setEditValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [setEditValues, setError]
  );

  const handleDelete = useCallback(
    (id) => {
      if (window.confirm("Delete this employee from database?")) {
        dispatch(deleteEmployee(id));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const filtered = savedEmployees
      .filter((employee) =>
        Object.values(employee).some((value) =>
          String(value).toLowerCase().startsWith(searchQuery.toLowerCase())
        )
      )
      .slice(0, Number(entriesToShow));
    setFilteredEmployees(filtered);
  }, [savedEmployees, searchQuery, entriesToShow]);

  // Memoized filtered employees based on search query
  // This will only recompute when savedEmployees or searchQuery changes
  useEffect(() => {
    const filtered = savedEmployees
      .filter((employee) =>
        Object.values(employee).some((value) =>
          String(value).toLowerCase().startsWith(searchQuery.toLowerCase())
        )
      )
      .slice(0, Number(entriesToShow));
    setFilteredEmployees(filtered);
  }, [savedEmployees, searchQuery, entriesToShow]);

  const totalFilteredEmployees = useMemo(
    () =>
      savedEmployees.filter((employee) =>
        Object.values(employee).some((value) =>
          String(value).toLowerCase().startsWith(searchQuery.toLowerCase())
        )
      ),
    [savedEmployees, searchQuery, entriesToShow]
  );

  const statesOptions = states.map((state) => (
    <option key={state.abbreviation} value={state.abbreviation}>
      {state.name}
    </option>
  ));

  const departmentsOptions = departments.map((dept) => (
    <option key={dept} value={dept}>
      {dept}
    </option>
  ));

  return (
    <Container fluid className="my-4">
      <Row>
        <Col lg={10} className="mx-auto">
          <div className="title mb-4 text-center">
            <h1>View Current Employees</h1>
          </div>
          <Row className="mb-3 justify-content-between align-items-center">
            <Col xs="auto">
              <Form.Select
                name="entriesToShow"
                value={entriesToShow}
                onChange={(e) => setEntriesToShow(e.target.value)}
                aria-label="Entries to show"
                disabled={savedEmployees.length === 0}
              >
                <option value="10">Show 10 entries</option>
                <option value="25">Show 25 entries</option>
                <option value="50">Show 50 entries</option>
                <option value="100">Show 100 entries</option>
                <option value={savedEmployees.length}>Show ALL entries</option>
              </Form.Select>
            </Col>
            <Col md="auto">
              <Form.Control
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search employee data"
                disabled={savedEmployees.length === 0}
              />
            </Col>
          </Row>
          <Suspense fallback={<Loader />}>
            {filteredEmployees.length > 0 ? (
              <>
                <EmployeeTable
                  keys={keys}
                  filteredEmployees={filteredEmployees}
                  setFilteredEmployees={setFilteredEmployees}
                  editId={editId}
                  editValues={editValues}
                  handleEditChange={handleEditChange}
                  error={error}
                  departmentsOptions={departmentsOptions}
                  statesOptions={statesOptions}
                  handleEditSave={handleEditSave}
                  setEditId={setEditId}
                  enterEditMode={enterEditMode}
                  handleDelete={handleDelete}
                />
                <p className="text-left">
                  Showing {totalFilteredEmployees.length === 0 ? 0 : 1} to{" "}
                  {filteredEmployees.length} of {savedEmployees.length} entries
                </p>
              </>
            ) : (
              <Alert variant="danger" className="text-center my-5">
                No employee data found
              </Alert>
            )}
          </Suspense>
          <div className="text-center">
            <Link to="/">Home</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EmployeesListPage;
