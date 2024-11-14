import React from 'react';
import { Input } from '@chakra-ui/react';

interface DateInputProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
}

const DateInput: React.FC<DateInputProps> = ({ value, onChange, onBlur, onKeyDown }) => {
  return (
    <Input
      type="date"
      value={value || ""}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      variant="flushed"
      autoFocus
      style={{
        fontSize: "14px",
        fontWeight: "600",
        border: "none",
        outline: "none",
        textDecoration: "underline",
        boxShadow: "-1px 0px 10px 0px gray",
        borderRadius: "5px",
        padding: "10px",
        width: "250px",
        height: "38px",
        position: "absolute",
        backgroundColor: "white",
        marginTop: "-16px",
      }}
    />
  );
};

export default DateInput;
