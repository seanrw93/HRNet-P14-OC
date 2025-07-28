import { memo } from 'react';

import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

import { reformatCamelCase } from '../utils/reformatCamelCase';

const EmployeeDataTableRow = ({ 
    employee, 
    editId, 
    keys, 
    editValues, 
    handleEditChange, 
    error, 
    departmentsOptions, 
    statesOptions, 
    handleEditSave, 
    setEditId, 
    enterEditMode, 
    handleDelete }) => {

  const formInputType = (key) => {
    if (key === "id") {
      return null;
    }

    if (key === "department" || key === "state") {
      return (
        <td key={key}>
          <Form.Select
            name={key}
            value={editValues[key] || ""}
            onChange={handleEditChange}
          >
            {key === "department" ? departmentsOptions : statesOptions}
          </Form.Select>
        </td>
      );
    }

    if (key === "dateOfBirth" || key === "startDate") {
      return (
        <td key={key}>
          <Form.Control
            type="text"
            name={key}
            value={editValues[key] || ""}
            onChange={handleEditChange}
            isInvalid={error.includes(key)}
            />
            <Form.Control.Feedback type="invalid">
                Please provide a valid date in YYYY-MM-DD format before {new Date().toISOString().slice(0, 10)}.
            </Form.Control.Feedback>
        </td>
      );
    }

    return (
      <td key={key}>
        <Form.Control
          type={key === "zipCode" ? "number" : "text"}
          name={key}
          value={editValues[key] || ""}
          onChange={handleEditChange}
          isInvalid={error.includes(key)}
        />
        <Form.Control.Feedback type="invalid">
          Please provide a {reformatCamelCase(key).toLowerCase()}.
        </Form.Control.Feedback>
      </td>
    );
  };

    return (
      editId === employee.id ? (
        <tr key={employee.id} id={employee.id}>
          {keys.map((key) =>
            formInputType(key)
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
              <Button type="button" variant="primary" onClick={() => enterEditMode(employee)}>Edit</Button>
              <Button type="button" variant="danger" onClick={() => handleDelete(employee.id)}>Delete</Button>
            </ButtonGroup>
          </td>
        </tr>
      )
    );
}

export default memo(EmployeeDataTableRow);