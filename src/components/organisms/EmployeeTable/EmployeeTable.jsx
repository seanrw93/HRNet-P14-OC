import { memo } from "react";
import Table from "react-bootstrap/Table";
import EmployeeDataTableRow from "../../molecules/EmployeeDataTableRow/EmployeeDataTableRow";
import { reformatCamelCase } from "../../../utils/reformatCamelCase";
import SortButtons from "../../molecules/SortButtons/SortButtons";

const EmployeeTable = ({
  keys,
  filteredEmployees,
  setFilteredEmployees,
  editId,
  editValues,
  handleEditChange,
  error,
  departmentsOptions,
  statesOptions,
  handleEditSave,
  setEditId,
  enterEditMode,
  handleDelete,
}) => (
  <Table className="h-100" id="employee-table" responsive bordered striped>
    <thead>
      <tr>
        {keys.map(
          (key) =>
            key !== "id" && (
              <th key={key} className="employee-table-header">
                {reformatCamelCase(key)}
                <span>
                  <SortButtons
                    field={key}
                    filteredEmployees={filteredEmployees}
                    setFilteredEmployees={setFilteredEmployees}
                  />
                </span>
              </th>
            )
        )}
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
          enterEditMode={enterEditMode}
          handleDelete={handleDelete}
        />
      ))}
    </tbody>
  </Table>
);

export default memo(EmployeeTable);
