import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addEmployee } from "../store/employeeSlice"
import { states } from "../data/states"
import { departments } from '../data/departments'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'


const AddEmployeesPage = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const savedEmployees = useSelector((state) => state?.employees.employee);

  useEffect(() => {
    console.log(savedEmployees)
  }, [savedEmployees])

  // const [employee, setEmployee] = useState({
  //   firstName: "",
  //   lastName: "",
  //   dateOfBirth: "",
  //   startDate: "",
  //   street: "",
  //   city: "",
  //   state: "",
  //   zipCode: "",
  //   department: ""
  // })

    const [employee, setEmployee] = useState({
    firstName: "Mark",
    lastName: "Corrigan",
    dateOfBirth: "12/12/1975",
    startDate: "12/09/2004",
    street: "Burke St",
    city: "London",
    state: "",
    zipCode: "90009",
    department: ""
  })

  const [validated, setValidated] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const handleFormInput = (e) => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: value
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      setShowModal(true);
      dispatch(addEmployee(employee))
      //Saved to local storage until back end established
      const currentList = JSON.parse(localStorage.getItem("employeeList")) || [];
      currentList.push(employee);
      localStorage.setItem("employeeList", JSON.stringify(currentList));
    }
      setValidated(true);
  };

  const closeModal = () => {
    setShowModal(false);
    navigate("/employees-list");
  }

  return ( 
      <Container fluid className="my-4">
        <Row>
          <Col xs={12} md={8} lg={6} className="mx-auto">
            <div className="title mb-4 w-100 text-center">
              <h1>HRnet</h1>
              <Link to="/employees-list" className="btn btn-link mb-3 p-0">View Current Employees</Link>
            </div>
            <h2 className="mb-4 text-center">Create Employee</h2>
            <Form
              id="create-employee"
              className="d-flex flex-column gap-2"
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
            >
              <Form.Group className="mb-3" controlId="formGroupFirstName">
                <Form.Label className="mb-2">First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={employee.firstName}
                  onChange={handleFormInput}
                  isInvalid={validated && !employee.firstName}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a first name.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGroupLastName">
                <Form.Label className="mb-2">Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={employee.lastName}
                  onChange={handleFormInput}
                  isInvalid={validated && !employee.lastName}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a last name.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGroupDOB">
                <Form.Label className="mb-2">Date of Birth</Form.Label>
                <Form.Control
                  type="text"
                  name="dateOfBirth"
                  value={employee.dateOfBirth}
                  onChange={handleFormInput}
                  isInvalid={validated && !employee.dateOfBirth}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a date of birth.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGroupStartDate">
                <Form.Label className="mb-2">Start Date</Form.Label>
                <Form.Control
                  type="text"
                  name="startDate"
                  value={employee.startDate}
                  onChange={handleFormInput}
                  isInvalid={validated && !employee.startDate}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a start date.
                </Form.Control.Feedback>
              </Form.Group>
              <fieldset className="address border rounded p-3 mb-3">
                <legend className="float-none w-auto px-2">Address</legend>
                <Form.Group className="mb-2" controlId="formGroupStreet">
                  <Form.Label>Street</Form.Label>
                  <Form.Control
                    type="text"
                    name="street"
                    value={employee.street}
                    onChange={handleFormInput}
                    isInvalid={validated && !employee.street}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a street.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-2" controlId="formGroupCity">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={employee.city}
                    onChange={handleFormInput}
                    isInvalid={validated && !employee.city}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a city.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-2" controlId="formGroupState">
                  <Form.Label>State</Form.Label>
                  <Form.Select
                    name="state"
                    value={employee.state}
                    onChange={handleFormInput}
                    isInvalid={validated && !employee.state}
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.abbreviation} value={state.abbreviation}>
                        {state.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a state.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-2" controlId="formGroupZip">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control
                    type="number"
                    name="zipCode"
                    value={employee.zipCode}
                    onChange={handleFormInput}
                    isInvalid={validated && !employee.zipCode}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a zip code.
                  </Form.Control.Feedback>
                </Form.Group>
              </fieldset>
              <Form.Group className="mb-3" controlId="formGroupDepartment">
                <Form.Label>Department</Form.Label>
                <Form.Select
                  name="department"
                  value={employee.department}
                  onChange={handleFormInput}
                  isInvalid={validated && !employee.department}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select a department.
                </Form.Control.Feedback>
              </Form.Group>
              <Button
                type="submit"
                variant="primary"
                className="w-100 mt-3"
              >
                Save
              </Button>
            </Form>
            <Modal
              show={showModal}
              onHide={closeModal}
              className="mt-3">
                <Modal.Header className="bg-secondary text-white" closeButton>Alert</Modal.Header>
                <Modal.Body>
                  <p>Employee sucessfully created</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={closeModal} variant="primary">Close</Button>
                </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </Container>
  )
}

export default AddEmployeesPage;