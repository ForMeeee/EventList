import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import Select from "react-select";

function SelectBox({
  name,
  options,
  isClearable,
  value,
  placeholder,
  handleChange,
  label,
  defaultValue
}) {
  return (
    <Form.Group className="mb-2">
      {label && <Form.Label>{label}</Form.Label>}      
      <InputGroup>
        <Select
          name={name}
          isClearable={isClearable}
          placeholder={placeholder}
          options={options}
          onChange={handleChange}
          value={value}
          defaultValue={value}
        />
      </InputGroup>

    </Form.Group>
  );
}

export default SelectBox;