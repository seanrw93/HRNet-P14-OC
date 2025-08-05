import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addEmployee } from "../store/employeeSlice";
import { states } from "../data/states";
import { departments } from "../data/departments";
import { convertToISO } from "../utils/convertToIso";

import DatePicker from "react-i18n-datepicker";
import "react-i18n-datepicker/dist/react-i18n-datepicker.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import SelectInput from "../components/SelectInput";

const AddEmployeesPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    startDate: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    department: ""
  })
  const [validated, setValidated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormInput = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      setIsSubmitting(true);
      setShowModal(true);

      const addEmployeeData = {
        ...employee,
        dateOfBirth: convertToISO(employee.dateOfBirth),
        startDate: convertToISO(employee.startDate),
      };
      dispatch(addEmployee(addEmployeeData));
      // Save to local storage (in place of API call until backend is implemented)
      const currentList = JSON.parse(localStorage.getItem("employeeList")) || [];
      currentList.push(addEmployeeData);
      localStorage.setItem("employeeList", JSON.stringify(currentList));
      console.log("Employee added:", employee);
    }
    setValidated(true);
  };

  const closeModal = () => {
    setShowModal(false);
    navigate("/employees-list");
  };

  return (
    <Container fluid className="my-4">
      <Row>
        <Col xs={12} md={8} lg={6} className="mx-auto">
          <div className="title mb-4 w-100 text-center">
            <h1>HRnet</h1>
            <Link to="/employees-list" className="btn btn-link mb-3 p-0">
              View Current Employees
            </Link>
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
              <DatePicker
                inputId="formGroupDOB"
                inputClassName="form-control"
                inputName="dateOfBirth"
                onChange={handleFormInput}
                value={employee.dateOfBirth}
                isRequired={true}
                maxDate={new Date()}
                minDate={new Date(1920, 0, 1)}
                minYear={1920}
                maxYear={2025}
                locale="en"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a date of birth.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupStartDate">
              <Form.Label className="mb-2">Start Date</Form.Label>
              <DatePicker
                inputId="formGroupStartDate"
                inputClassName="form-control"
                inputName="startDate"
                onChange={handleFormInput}
                value={employee.startDate}
                isRequired={true}
                maxDate={new Date()}
                minDate={new Date(1920, 0, 1)}
                minYear={1920}
                maxYear={2025}
                locale="en"
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
              <SelectInput
                label="State"
                name="state"
                value={employee.state}
                onChange={handleFormInput}
                options={states.map((state) => ({
                  value: state.abbreviation,
                  label: state.name,
                }))}
                isInvalid={validated && !employee.state}
                required
                feedback="Please select a state."
              />
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
            <SelectInput
              label="Department"
              name="department"
              value={employee.department}
              onChange={handleFormInput}
              options={departments}
              isInvalid={validated && !employee.department}
              required
              feedback="Please select a department."
            />
            <Button 
              type="submit" 
              variant="primary" 
              className="w-100 mt-3"
              disabled={isSubmitting}
            >
              Save
            </Button>
          </Form>
          <Modal show={showModal} onHide={closeModal} className="mt-3">
            <Modal.Header className="bg-secondary text-white" closeButton>
              Alert
            </Modal.Header>
            <Modal.Body>
              <p>Employee sucessfully created</p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={closeModal} variant="primary">
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default AddEmployeesPage;
