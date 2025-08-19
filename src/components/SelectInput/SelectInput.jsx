import Form from "react-bootstrap/Form";

const SelectInput = ({
  label,
  name,
  value,
  onChange,
  options,
  isInvalid,
  required,
  feedback,
  ...rest
}) => (
  <Form.Group className="mb-2" controlId={`formGroup${name}`}>
    <Form.Label>{label}</Form.Label>
    <Form.Select
      name={name}
      value={value}
      onChange={onChange}
      isInvalid={isInvalid}
      required={required}
      {...rest}
    >
      <option value="">Select {label}</option>
      {options.map((opt) =>
        typeof opt === "object" ? (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ) : (
          <option key={opt} value={opt}>
            {opt}
          </option>
        )
      )}
    </Form.Select>
    <Form.Control.Feedback type="invalid">
      {feedback}
    </Form.Control.Feedback>
  </Form.Group>
);

export default SelectInput;