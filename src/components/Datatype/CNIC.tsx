import React from 'react';
import { Input } from '@chakra-ui/react';

interface CnicInputProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
}

const CnicInput: React.FC<CnicInputProps> = ({ value, onChange, onBlur, onKeyDown }) => {
  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cnic = e.target.value;

    // Only allow numbers and hyphen
    if (/[^0-9-]/.test(cnic)) {
      return; // Prevent input if it's not a number or hyphen
    }

    // Automatically add hyphens as user types
    if (/^\d{5}$/.test(cnic)) {
      e.target.value = cnic + "-";
    } else if (/^\d{5}-\d{7}$/.test(cnic)) {
      e.target.value = cnic + "-";
    }

    onChange(e); // Update the input state

    // Save to localStorage if CNIC is complete
    if (cnic.length === 15) {
      localStorage.setItem("cnic", cnic);
    }
  };

  return (
    <Input
      type="text"
      pattern="\d{5}-\d{7}-\d" // CNIC pattern
      placeholder="XXXXX-XXXXXXX-X"
      value={value || ""}
      maxLength={15} // Limits input to 13 digits plus two hyphens
      onChange={handleCnicChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      variant="flushed"
      autoFocus
      style={{
        fontSize: "14px",
        fontWeight: "600",
        border: "none",
        outline: "none",
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

export default CnicInput;
