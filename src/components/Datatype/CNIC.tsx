import React from 'react';
import { Input } from '@chakra-ui/react';
import { useLocalStorage } from "../../hooks/useLocalStorage"; // Import the custom hook

interface CnicInputProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
}

const CnicInput: React.FC<CnicInputProps> = ({ value, onChange, onBlur, onKeyDown }) => {
  // Use the useLocalStorage hook to manage CNIC value
  const [cnic, setCnic] = useLocalStorage<string>("cnic", value || "");

  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cnicValue = e.target.value;

    // Only allow numbers and hyphen
    if (/[^0-9-]/.test(cnicValue)) {
      return; // Prevent input if it's not a number or hyphen
    }

    // Automatically add hyphens as user types
    if (/^\d{5}$/.test(cnicValue)) {
      e.target.value = cnicValue + "-";
    } else if (/^\d{5}-\d{7}$/.test(cnicValue)) {
      e.target.value = cnicValue + "-";
    }

    setCnic(e.target.value); // Update CNIC state

    // Save to localStorage if CNIC is complete
    if (cnicValue.length === 15) {
      setCnic(cnicValue); // Ensure the CNIC is saved in localStorage
    }

    onChange(e); // Update the input state
  };

  return (
    <Input
      type="text"
      pattern="\d{5}-\d{7}-\d" // CNIC pattern
      placeholder="XXXXX-XXXXXXX-X"
      value={cnic || ""} // Bind the value to the useLocalStorage state
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
