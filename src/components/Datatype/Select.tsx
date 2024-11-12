import React, { useEffect, useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent, PopoverBody, Input, Select } from '@chakra-ui/react';

interface SelectPopoverProps {
  row: { [key: string]: any }; // Row object with column data
  col: { name: string }; // Column object with 'name' property
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Handler for value change
  handleBlur: () => void; // Handler for blur event
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => void; // Handler for keydown event
}

const SelectPopover: React.FC<SelectPopoverProps> = ({
  row,
  col,
  handleChange,
  handleBlur,
  handleKeyDown
}) => {

  const [newOption, setNewOption] = useState<string>("");
  const [selectOptions, setSelectOptions] = useState<string[]>(() => {
    const savedOptions = localStorage.getItem("selectOptions");
    return savedOptions ? JSON.parse(savedOptions) : [];
  });
  const [editingOption, setEditingOption] = useState<{
    oldValue: string;
    newValue: string;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem("selectOptions", JSON.stringify(selectOptions));
  }, [selectOptions]);

  const handleAddOption = () => {
    if (newOption && !selectOptions.includes(newOption)) {
      setSelectOptions((prev) => [...prev, newOption]);
      setNewOption("");
    }
  };

  const handleDeleteOption = (option: string) => {
    setSelectOptions((prev) => prev.filter((opt) => opt !== option));
  };

  const handleEditOption = (option: string) => {
    if (editingOption?.oldValue === option) {
      setEditingOption(null); // Exit edit mode
    } else {
      setEditingOption({ oldValue: option, newValue: option }); // Enter edit mode
    }
  };

  const handleSaveEdit = () => {
    if (editingOption) {
      setSelectOptions((prev) =>
        prev.map((opt) =>
          opt === editingOption.oldValue ? editingOption.newValue : opt
        )
      );
      setEditingOption(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingOption) {
      setEditingOption({ ...editingOption, newValue: e.target.value });
    }
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Input
          value={row[col.name] || "Select..."} // Show placeholder if no value is selected
          type="text"
          readOnly
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>
          <Select
            value={row[col.name] || ""} // Default to empty string if no selection
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          >
            <option value="">Select...</option> {/* Placeholder */}
            {selectOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <div style={{ marginTop: "10px" }}>
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="Add new option"
              style={{ marginRight: "5px" }}
            />
            <button onClick={handleAddOption}>Add</button>
          </div>
          <div style={{ marginTop: "5px" }}>
            <h4>Existing Options:</h4>
            <ul>
              {selectOptions.map((option) => (
                <li
                  key={option}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {editingOption?.oldValue === option ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        value={editingOption.newValue}
                        onChange={handleInputChange}
                        placeholder="Edit option"
                        style={{ marginRight: "5px" }}
                      />
                      <button onClick={handleSaveEdit}>Save</button>
                    </div>
                  ) : (
                    <>
                      <span
                        onClick={() => handleEditOption(option)}
                        style={{ cursor: "pointer" }}
                      >
                        {option}
                      </span>
                      <div>
                        <button
                          onClick={() => handleEditOption(option)}
                          style={{ marginLeft: "5px" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteOption(option)}
                          style={{ marginLeft: "5px" }}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default SelectPopover;
