import React, { useState, useEffect, useRef } from "react";
import { Badge, Input, Box } from "@chakra-ui/react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";

interface Option {
  label: string;
  backgroundColor?: string;
}

interface SelectCellProps {
  initialValue: string;
  options: Option[];
  columnId: string;
  rowIndex: number;
  dataDispatch: React.Dispatch<any>; // Replace `any` with your specific action type if defined
}

const SelectCell: React.FC<SelectCellProps> = ({
  initialValue,
  options,
  columnId,
  rowIndex,
  dataDispatch,
}) => {
  const [selectRef, setSelectRef] = useState<HTMLDivElement | null>(null);
  const [selectPop, setSelectPop] = useState<HTMLDivElement | null>(null);
  const [showSelect, setShowSelect] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addSelectRef, setAddSelectRef] = useState<HTMLInputElement | null>(null);
  const [value, setValue] = useState<{ value: string; update: boolean }>({ value: initialValue, update: false });
  
  const { styles, attributes } = usePopper(selectRef, selectPop, {
    placement: 'bottom-start',
    strategy: 'fixed',
  });

  useEffect(() => {
    setValue({ value: initialValue, update: false });
  }, [initialValue]);

  useEffect(() => {
    if (value.update) {
      dataDispatch({
        type: "UPDATE_CELL", // Replace with your action type
        columnId,
        rowIndex,
        value: value.value,
      });
    }
  }, [value, columnId, rowIndex, dataDispatch]);

  useEffect(() => {
    if (addSelectRef && showAdd) {
      addSelectRef.focus();
    }
  }, [addSelectRef, showAdd]);

  const handleOptionClick = (option: Option) => {
    setValue({ value: option.label, update: true });
    setShowSelect(false);
  };

  const handleAddOption = () => {
    setShowAdd(true);
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.currentTarget as HTMLInputElement; // Type assertion
    if (e.key === 'Enter' && target.value) {
      dataDispatch({
        type: "ADD_OPTION_TO_COLUMN", // Replace with your action type
        option: target.value,
        backgroundColor: "black", // Replace with logic to generate a random color
        columnId,
      });
      setShowAdd(false);
    }
  };

  const handleOptionBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement; // Type assertion
    if (target.value) {
      dataDispatch({
        type: "ADD_OPTION_TO_COLUMN", // Replace with your action type
        option: target.value,
        backgroundColor: "black", // Replace with logic to generate a random color
        columnId,
      });
    }
    setShowAdd(false);
  };

  return (
    <>
      <div
        ref={setSelectRef}
        onClick={() => setShowSelect(true)}
        style={{ cursor: "pointer", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
      >
        {value.value && <Badge>{value.value}</Badge>}
      </div>
      {showSelect && (
        <div className="overlay" onClick={() => setShowSelect(false)} />
      )}
      {showSelect &&
        createPortal(
          <Box
            ref={setSelectPop}
            {...attributes.popper}
            style={{
              ...styles.popper,
              zIndex: 4,
              minWidth: "200px",
              maxWidth: "320px",
              maxHeight: "400px",
              padding: "0.75rem",
              overflow: "auto",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box display="flex" flexDirection="column" mt="-0.5rem">
              {options.map((option) => (
                <Box
                  key={option.label}
                  style={{ cursor: "pointer", padding: "4px", margin: "4px 0" }}
                  onClick={() => handleOptionClick(option)}
                >
                  <Badge backgroundColor={option.backgroundColor}>{option.label}</Badge>
                </Box>
              ))}
              {showAdd && (
                <Input
                  placeholder="Add new option"
                  ref={setAddSelectRef}
                  onBlur={handleOptionBlur}
                  onKeyDown={handleOptionKeyDown}
                />
              )}
              <Box onClick={handleAddOption} style={{ cursor: "pointer", marginTop: "4px" }}>
                <Badge backgroundColor="black">+ Add Option</Badge>
              </Box>
            </Box>
          </Box>,
          document.body // Or use a specific portal root
        )}
    </>
  );
};

export default SelectCell;
