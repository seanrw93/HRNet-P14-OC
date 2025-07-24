import { memo } from 'react';

import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

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
    editMode, 
    handleDelete }) => {

    return (
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
    );
}

export default memo(EmployeeDataTableRow);