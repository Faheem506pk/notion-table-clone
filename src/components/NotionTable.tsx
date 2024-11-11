import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useDisclosure,
  PopoverArrow,
  Heading,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Badge,
  HStack,
  Text,
  VStack,
  Switch,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { VscListFlat } from "react-icons/vsc";
import { MdNumbers } from "react-icons/md";
import { GrTextAlignFull } from "react-icons/gr";
import { GoSingleSelect, GoTag } from "react-icons/go";
import { BsCalendarDate } from "react-icons/bs";
import { MdDragIndicator } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import TagsInput from "react-tagsinput";
import { GrStatusGood } from "react-icons/gr";
import { FaArrowDown, FaArrowUp, FaSearch } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { LuPhone } from "react-icons/lu";
import { FaRegIdCard } from "react-icons/fa";
import "react-tagsinput/react-tagsinput.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { TfiShine } from "react-icons/tfi";

interface Column {
  name: string;
  dataType: string;
  width: number;
}

interface Row {
  [key: string]: any;
}

const NotionTable: React.FC = () => {
  const [taskName, setTaskName] = useState(
    localStorage.getItem("taskName") || "Task Name"
  );
  const [tableName, setTableName] = useState(
    localStorage.getItem("tableName") || "Table Name"
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [isEditingTable, setIsEditingTable] = useState(false);
  const [newColumnName, setNewColumnName] = useState<string>("");
  const [newColumnType, setNewColumnType] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const openAlertDialog = () => setIsAlertOpen(true);
  const closeAlertDialog = () => setIsAlertOpen(false);

  const [selectOptions, setSelectOptions] = useState<string[]>(() => {
    const savedOptions = localStorage.getItem("selectOptions");
    return savedOptions ? JSON.parse(savedOptions) : [""];
  });
  const [badgeColors, setBadgeColors] = useState<Record<string, string>>(() => {
    const storedColors = localStorage.getItem("badgeColors");
    return storedColors ? JSON.parse(storedColors) : {};
  });

  const handleSelectAllRows = () => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.size === rows.length) {
      // Deselect all
      newSelectedRows.clear();
    } else {
      // Select all
      rows.forEach((_, index) => newSelectedRows.add(index));
    }
    setSelectedRows(newSelectedRows);
  };
  const handleDeleteSelectedRows = () => {
    const remainingRows = rows.filter((_, index) => !selectedRows.has(index));
    setRows(remainingRows); // Update rows state
    setSelectedRows(new Set()); // Clear selection
  };

  const handleSelectRow = (rowIndex: number) => {
    const newSelectedRows = new Set(selectedRows);

    if (newSelectedRows.has(rowIndex)) {
      newSelectedRows.delete(rowIndex);
    } else {
      newSelectedRows.add(rowIndex);
    }
    setSelectedRows(newSelectedRows);
  };

  const [rows, setRows] = useState<Row[]>(() => {
    const storedRows = localStorage.getItem("rows");
    return storedRows
      ? JSON.parse(storedRows)
      : [
          { Name: "", "Father Name": "", Age: null, "Date of Birth": null },
          { Name: "", "Father Name": "", Age: null, "Date of Birth": null },
          { Name: "", "Father Name": "", Age: null, "Date of Birth": null },
          { Name: "", "Father Name": "", Age: null, "Date of Birth": null },
          { Name: "", "Father Name": "", Age: null, "Date of Birth": null },
          { Name: "", "Father Name": "", Age: null, "Date of Birth": null },
          { Name: "", "Father Name": "", Age: null, "Date of Birth": null },
          { Name: "", "Father Name": "", Age: null, "Date of Birth": null },
        ];
  });

  useEffect(() => {
    // Retrieve badge colors and rows data from localStorage when the component mounts
    const storedBadgeColors = localStorage.getItem("badgeColors");
    const storedRows = localStorage.getItem("rows");

    if (storedBadgeColors) {
      setBadgeColors(JSON.parse(storedBadgeColors));
    }

    if (storedRows) {
      setRows(JSON.parse(storedRows));
    }
  }, []);

  const [tagPopoverRow, setTagPopoverRow] = useState<{
    rowIndex: number;
    colName: string;
  } | null>(null);

  const tagColorSchemes = [
    "red",
    "green",
    "blue",
    "purple",
    "yellow",
    "orange",
    "teal",
    "pink",
  ];

  const getRandomColorScheme = (tag: string) => {
    if (!badgeColors[tag]) {
      const newColor =
        tagColorSchemes[Math.floor(Math.random() * tagColorSchemes.length)];
      setBadgeColors((prevColors) => {
        const updatedColors = { ...prevColors, [tag]: newColor };
        localStorage.setItem("badgeColors", JSON.stringify(updatedColors));
        return updatedColors;
      });
      return newColor;
    }
    return badgeColors[tag];
  };

  const handleTagsInputChange = (
    rowIndex: number,
    colName: string,
    tags: string[]
  ) => {
    // Create a deep copy of rows to ensure immutability
    const updatedRows = [...rows]; // Shallow copy of the array
    const updatedRow = { ...updatedRows[rowIndex] }; // Shallow copy of the specific row

    // Update the specific column with the new tags
    updatedRow[colName] = tags.join(","); // Convert the tags array to a comma-separated string

    // Put the updated row back in the array
    updatedRows[rowIndex] = updatedRow;

    // Update the rows state
    setRows(updatedRows);

    // Optionally, update localStorage if needed
    localStorage.setItem("rows", JSON.stringify(updatedRows));
  };

  const [newOption, setNewOption] = useState<string>("");
  const [editingOption, setEditingOption] = useState<{
    oldValue: string;
    newValue: string;
  } | null>(null);

  const getIconByType = (dataType: string) => {
    // Change parameter name to dataType
    switch (dataType) {
      case "string":
        return <GrTextAlignFull style={{ marginRight: "5px" }} />;
      case "number":
        return <MdNumbers style={{ marginRight: "5px" }} />;
      case "date":
        return <BsCalendarDate style={{ marginRight: "5px" }} />;
      case "select":
        return <GoSingleSelect style={{ marginRight: "5px" }} />;
      case "tags":
        return <GoTag style={{ marginRight: "5px" }} />;
      case "status":
        return <TfiShine style={{ marginRight: "5px" }} />;
      default:
        return <VscListFlat style={{ marginRight: "5px" }} />;
    }
  };

  // Function to update localStorage whenever selectOptions changes
  useEffect(() => {
    localStorage.setItem("selectOptions", JSON.stringify(selectOptions));
  }, [selectOptions]);

  useEffect(() => {
    if (newColumnName || newColumnType) {
      console.log(`New column name: ${newColumnName}, type: ${newColumnType}`);
    }
  }, [newColumnName, newColumnType]);

  useEffect(() => {
    localStorage.setItem("taskName", taskName);
  }, [taskName]);

  useEffect(() => {
    localStorage.setItem("tableName", tableName);
  }, [tableName]);

  const handleTaskClick = () => {
    setIsEditingTask(true);
  };

  const handleTableClick = () => {
    setIsEditingTable(true);
  };

  const handleTaskBlur = () => {
    setIsEditingTask(false);
  };

  const handleTableBlur = () => {
    setIsEditingTable(false);
  };

  const handleMouseDown = (index: number) => (event: React.MouseEvent) => {
    const startX = event.clientX;
    const startWidth = columns[index].width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(startWidth + moveEvent.clientX - startX, 50);
      setColumns((prevColumns) =>
        prevColumns.map((col, i) =>
          i === index ? { ...col, width: newWidth } : col
        )
      );
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleAddRow = () => {
    const newRow: Row = {};
    columns.forEach((col) => {
      newRow[col.name] = "";
    });
    setRows([...rows, newRow]);
  };

  const [columns, setColumns] = useState<Column[]>(() => {
    const storedColumns = localStorage.getItem("columns");
    return storedColumns
      ? JSON.parse(storedColumns)
      : [
          { name: "Name", dataType: "string", width: 150 },
          { name: "Father Name", dataType: "string", width: 150 },
          { name: "Age", dataType: "number", width: 100 },
          { name: "Date of Birth", dataType: "date", width: 150 },
        ];
  });

  const handleDeleteRow = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const [editingCell, setEditingCell] = useState<{
    rowIndex: number;
    colIndex: number;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem("rows", JSON.stringify(rows));
  }, [rows]);

  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  const handleAddRowUnder = (index?: number) => {
    const newRow: Row = {};
    columns.forEach((col) => {
      newRow[col.name] = "";
    });

    if (typeof index === "number") {
      const updatedRows = [...rows];
      updatedRows.splice(index + 1, 0, newRow);
      setRows(updatedRows);
    } else {
      setRows([...rows, newRow]);
    }
  };

  const handleAddColumn = (type: string, name: string) => {
    // Check if a new column name is provided
    if (name) {
      // Check if the column name already exists
      let newName = name;
      let counter = 1;
      while (columns.some((column) => column.name === newName)) {
        newName = `${name}${counter}`; // Append a number to make the name unique
        counter++;
      }

      // Create a new column object with the unique name
      const newColumn: Column = {
        name: newName,
        dataType: type,
        width: 150, // Default width for the new column
      };

      // Update the columns state by adding the new column
      setColumns((prevColumns) => [...prevColumns, newColumn]);

      // Update each row to include the new column with a default value
      setRows((prevRows) =>
        prevRows.map((row) => ({
          ...row,
          [newName]: type === "select" ? "" : "", // Set default value for new column
        }))
      );

      // Reset the column name and type for future additions
      setNewColumnName(""); // No need to reset since we're passing new names directly
      setNewColumnType("string"); // Reset to default type if needed
      onClose(); // Close the popover
    }
    console.log(`Added column of type: ${type} with name: ${name}`);
  };

  const handleChangeColumnType = (index: number, newDataType: string) => {
    const updatedColumns = [...columns];
    updatedColumns[index].dataType = newDataType;
    setColumns(updatedColumns);
  };

  const handleDeleteColumn = (columnName: string) => {
    const updatedColumns = columns.filter((col) => col.name !== columnName);
    const updatedRows = rows.map((row) => {
      const newRow = { ...row };
      delete newRow[columnName];
      return newRow;
    });
    setColumns(updatedColumns);
    setRows(updatedRows);
  };

  const handleChangeColumnName = (index: number, newName: string) => {
    if (newName) {
      // Transfer existing row data to the new column name
      const updatedRows = rows.map((row) => {
        const newRow = { ...row };
        if (columns[index].name !== newName) {
          newRow[newName] = newRow[columns[index].name];
          delete newRow[columns[index].name];
        }
        return newRow;
      });

      setRows(updatedRows);

      setColumns((prevColumns) => {
        const newColumns = [...prevColumns];
        newColumns[index].name = newName;
        return newColumns;
      });
    }
  };

  // Save to local storage function
  const saveToLocalStorage = (key: string, data: Column[] | Row[]): void => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleDragEnd = (result: {
    source: any;
    destination: any;
    type: any;
  }) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === "COLUMN") {
      // Dragging columns
      const reorderedColumns = Array.from(columns);
      const [movedColumn] = reorderedColumns.splice(source.index, 1);
      reorderedColumns.splice(destination.index, 0, movedColumn);
      setColumns(reorderedColumns);
      saveToLocalStorage("columns", reorderedColumns);
    } else {
      // Dragging rows
      const reorderedRows = Array.from(rows);
      const [movedRow] = reorderedRows.splice(source.index, 1);
      reorderedRows.splice(destination.index, 0, movedRow);
      setRows(reorderedRows);
      saveToLocalStorage("rows", reorderedRows);
    }
  };

  const confirmDelete = (columnName: string) => {
    handleDeleteColumn(columnName);
    closeAlertDialog();
  };

  const renderInputField = (
    row: Row,
    col: Column,
    rowIndex: number,
    colIndex: number
  ) => {
    const isEditing =
      editingCell?.rowIndex === rowIndex && editingCell?.colIndex === colIndex;

    const handleCellClick = () => {
      if (!isEditing) {
        setEditingCell({ rowIndex, colIndex });
      }
    };

    const handleBlur = () => {
      setEditingCell(null);
    };

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const value = e.target.value;
      setRows((prevRows) =>
        prevRows.map((r, i) =>
          i === rowIndex ? { ...r, [col.name]: value } : r
        )
      );
    };

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

    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      // Check if the input is focused to allow typing
      if (
        editingCell &&
        editingCell.rowIndex === rowIndex &&
        editingCell.colIndex === colIndex
      ) {
        switch (e.key) {
          case "Enter":
            handleBlur(); // Save data and exit editing mode
            break;
          case "Tab":
            e.preventDefault(); // Prevent default tab behavior
            const isShift = e.shiftKey;
            const nextColIndex = colIndex + (isShift ? -1 : 1);
            let nextRowIndex = rowIndex;

            if (isShift) {
              // Shift + Tab: Move to previous cell
              if (colIndex > 0) {
                setEditingCell({ rowIndex, colIndex: nextColIndex });
              } else if (rowIndex > 0) {
                nextRowIndex--; // Move up a row
                setEditingCell({
                  rowIndex: nextRowIndex,
                  colIndex: columns.length - 1,
                });
              }
            } else {
              // Tab: Move to next cell
              if (nextColIndex < columns.length) {
                setEditingCell({ rowIndex, colIndex: nextColIndex });
              } else {
                nextRowIndex++; // Move to the next row
                setEditingCell({ rowIndex: nextRowIndex, colIndex: 0 });
              }
            }
            break;
          case "ArrowDown":
            e.preventDefault();
            if (rowIndex + 1 < rows.length) {
              // Move to the first cell in the next row
              setEditingCell({ rowIndex: rowIndex + 1, colIndex });
            }
            break;
          case "ArrowUp":
            e.preventDefault();
            if (rowIndex > 0) {
              // Move to the first cell in the previous row
              setEditingCell({ rowIndex: rowIndex - 1, colIndex });
            }
            break;
          default:
            // Allow all other keys to work for input
            break;
        }
      } else {
        e.preventDefault(); // Prevent default behavior for all keys when not editing
      }
    };

    // Render input based on column data type
    if (isEditing) {
      if (col.dataType === "select") {
        return (
          <div>
            <Popover>
              <PopoverTrigger>
                <Input type="Select" readOnly placeholder="Select..." />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody>
                  <Select
                    value={row[col.name] || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                  >
                    <option value="">Select...</option>
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
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
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
          </div>
        );
      } else if (col.dataType === "date") {
        return (
          <Input
            type="date"
            value={row[col.name] || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            variant="flushed"
            autoFocus
            style={{
              fontSize: "14px",
              fontWeight: "600",
              border: "none",
              outline: "none",
              textDecoration: "underline",
              boxShadow: "-1px 0px 10px 0px gray  ",
              borderRadius: " 5px",
              padding: "10px",
              width: "250px",
              height: "38px",
              position: "absolute",
              backgroundColor: "white",
              marginTop: "-16px",
            }}
          />
        );
      } else if (col.dataType === "number") {
        return (
          <Input
            type="number"
            value={row[col.name] || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            variant="flushed"
            autoFocus
            style={{
              fontSize: "14px",
              fontWeight: "600",
              border: "none",
              outline: "none",
              textDecoration: "underline",
              boxShadow: "-1px 0px 10px 0px gray  ",
              borderRadius: " 5px",
              padding: "10px",
              width: "250px",
              height: "38px",
              position: "absolute",
              backgroundColor: "white",
              marginTop: "-16px",
            }}
          />
        );
      } else if (col.dataType === "cnic") {
        return (
          <Input
            type="text"
            pattern="\d{5}-\d{7}-\d" // CNIC pattern
            placeholder="XXXXX-XXXXXXX-X"
            value={row[col.name] || ""}
            maxLength={15} // Limits input to 13 digits plus two hyphens
            onChange={(e) => {
              const cnic = e.target.value;

              // Automatically add hyphens as user types
              if (/^\d{5}$/.test(cnic)) {
                e.target.value = cnic + "-";
              } else if (/^\d{5}-\d{7}$/.test(cnic)) {
                e.target.value = cnic + "-";
              }

              handleChange(e); // Update the input state

              // Save to localStorage if CNIC is complete
              if (cnic.length === 15) {
                localStorage.setItem("cnic", cnic);
              }
            }}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
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
      }else if (col.dataType === "email") {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Input for email address */}
            <Input
              type="email"
              value={row[col.name] || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(e); // Update state
      
                // Save the email in localStorage
                localStorage.setItem(`email_${rowIndex}`, e.target.value);
              }}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              variant="flushed"
              autoFocus
              placeholder="Enter email"
              style={{
                fontSize: "14px",
                fontWeight: "600",
                border: "none",
                outline: "none",
                textDecoration: "underline",
                boxShadow: "-1px 0px 10px 0px gray",
                borderRadius: "5px",
                padding: "10px",
                width: "160px",
                backgroundColor: "white",
                marginRight: "5px",
              }}
            />
            <Button
              padding={"0"}
              onClick={() => window.open(`mailto:${row[col.name]}`)}
              bg="none"
            >
              <MdOutlineEmail style={{ width: "17px", height: "17px" }} />
            </Button>
          </div>
        );
      }
      
      
 else if (col.dataType === "phone") {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Input
              type="number"
              value={row[col.name] || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                // Allow digits and plus symbol
                let value = e.target.value.replace(/[^0-9+]/g, ""); // Only digits and + are allowed
                // Limit to 14 characters (including '+')
                if (value.length > 14) {
                  value = value.slice(0, 14);
                }
                handleChange(e);
                localStorage.setItem(`phone_${rowIndex}`, value);
              }}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              variant="flushed"
              placeholder="Enter phone number"
              style={{
                fontSize: "14px",
                fontWeight: "600",
                border: "none",
                outline: "none",
                textDecoration: "underline",
                boxShadow: "-1px 0px 10px 0px gray",
                borderRadius: "5px",
                padding: "10px",
                width: "155px",
                backgroundColor: "white",
                marginRight: "5px",
              }}
            />
            
            <Button
  padding="0"
  onClick={() => window.location.href = `tel:${row[col.name]}`}
  bg="none"
>
  <LuPhone style={{ width: "17px", height: "17px", marginRight: "5px" }} />
</Button>



          </div>
        );
      }

      return (
        <Input
          value={row[col.name] || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          variant="flushed"
          autoFocus
          style={{
            fontSize: "14px",
            fontWeight: "600",
            border: "none",
            outline: "none",
            textDecoration: "underline",
            boxShadow: "-1px 0px 10px 0px gray  ",
            borderRadius: " 5px",
            padding: "10px",
            width: "250px",
            height: "38px",
            position: "absolute",
            backgroundColor: "white",
            marginTop: "-16px",
          }}
        />
      );
    }

    if (col.dataType === "status") {
      const handleStatusChange = (newStatus: string) => {
        // Save the new status to localStorage
        localStorage.setItem(`${rowIndex}_${col.name}`, newStatus); // Save the status in localStorage

        // Optionally, you can update the row directly if you want the status to be reflected in the UI immediately
        row[col.name] = newStatus; // Update the row status directly
      };

      // Check if status is already in localStorage, else fallback to row[col.name]
      const savedStatus = localStorage.getItem(`${rowIndex}_${col.name}`);
      const currentStatus = savedStatus || row[col.name] || "Inactive"; // Default to "Inactive" if no value exists

      return (
        <Popover
          isOpen={
            tagPopoverRow?.rowIndex === rowIndex &&
            tagPopoverRow?.colName === col.name
          }
          onClose={() => setTagPopoverRow(null)}
          placement="bottom-start"
        >
          <PopoverTrigger>
            <Box
              onClick={() => setTagPopoverRow({ rowIndex, colName: col.name })}
              cursor="pointer"
              minHeight="20px"
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              borderRadius="8px"
              padding="8px"
              backgroundColor="white"
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                {currentStatus === "Active" ? (
                  <GrStatusGood
                    style={{ marginRight: "8px", color: "green" }}
                  />
                ) : (
                  <GrStatusGood style={{ marginRight: "8px", color: "red" }} />
                )}
                {currentStatus}
              </span>
            </Box>
          </PopoverTrigger>

          <PopoverContent
            width={"150px"}
            color="white"
            borderRadius="10px"
            boxShadow="lg"
            minWidth="100px"
            border="1px solid"
            borderColor="gray.400"
            marginTop="-8px"
          >
            <PopoverArrow />
            <PopoverBody padding="5px">
              <Flex direction="column" gap="4px">
                {/* Buttons to change status */}
                <Button
                  onClick={() => handleStatusChange("Active")}
                  colorScheme="green"
                  variant="outline"
                  size="sm"
                >
                  <GrStatusGood
                    style={{ marginRight: "8px", color: "green" }}
                  />
                  Set Active
                </Button>
                <Button
                  onClick={() => handleStatusChange("Inactive")}
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                >
                  <GrStatusGood style={{ marginRight: "8px", color: "red" }} />
                  Set Inactive
                </Button>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      );
    }

    if (col.dataType === "tags") {
      // New tag handling logic
      return (
        <Popover
          isOpen={
            tagPopoverRow?.rowIndex === rowIndex &&
            tagPopoverRow?.colName === col.name
          }
          onClose={() => setTagPopoverRow(null)}
          placement="bottom-start"
        >
          <PopoverTrigger>
            <Box
              onClick={() => setTagPopoverRow({ rowIndex, colName: col.name })}
              cursor="pointer"
              minHeight="20px"
              width="100%"
            >
              <Flex wrap="wrap" gap="4px">
                {row[col.name]
                  ?.toString()
                  .split(",")
                  .filter((tag: any) => tag)
                  .map((tag: string, i: React.Key | null | undefined) => (
                    <Badge
                      padding={1}
                      borderRadius={4}
                      key={i}
                      colorScheme={
                        badgeColors[tag] || getRandomColorScheme(tag)
                      }
                      variant="solid"
                    >
                      {tag.trim()}
                    </Badge>
                  ))}
              </Flex>
            </Box>
          </PopoverTrigger>
          <PopoverContent
            width={"190px"}
            marginTop="-2px"
            color="white"
            borderRadius="lg"
            boxShadow="lg"
            minWidth="100px"
            border="1px solid"
            borderColor="gray.600"
          >
            <PopoverBody>
              <TagsInput
                value={
                  row[col.name]?.toString().split(",").filter(Boolean) || []
                }
                onChange={(tags) =>
                  handleTagsInputChange(rowIndex, col.name, tags)
                }
                inputProps={{
                  placeholder: "Add tags",
                  autoFocus: true,
                  style: { backgroundColor: "gray.200", borderradius: "18px" },
                }}
              />
            </PopoverBody>
          </PopoverContent>
        </Popover>
      );
    }

    // Render the cell's current value when not editing
    return (
      <div
        onClick={handleCellClick}
        style={{ cursor: "pointer", padding: "7px" }}
      >
        {row[col.name] || ""}
      </div>
    );
  };

  const sortColumn = (colIndex: number, order: "asc" | "desc") => {
    const sortedRows = [...rows].sort((a, b) => {
      const valA = a[columns[colIndex].name];
      const valB = b[columns[colIndex].name];

      // Function to check if a value is empty, null, or only whitespace
      const isEmpty = (value: any) =>
        value == null || (typeof value === "string" && value.trim() === "");

      // Handle empty values by pushing them to the end
      if (isEmpty(valA) && isEmpty(valB)) return 0;
      if (isEmpty(valA)) return 1; // valA is empty, push it to the end
      if (isEmpty(valB)) return -1; // valB is empty, push it to the end

      // Compare non-empty values
      if (typeof valA === "number" && typeof valB === "number") {
        return order === "asc" ? valA - valB : valB - valA;
      } else if (typeof valA === "string" && typeof valB === "string") {
        return order === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else if (valA instanceof Date && valB instanceof Date) {
        return order === "asc"
          ? valA.getTime() - valB.getTime()
          : valB.getTime() - valA.getTime();
      }

      return 0;
    });
    setRows(sortedRows);
  };

  return (
    <>
      <div className="headings" style={{ marginTop: "80px" }}>
        <div className="inner-headings">
          {isEditingTask ? (
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              onBlur={handleTaskBlur}
              autoFocus
              style={{
                fontSize: "40px",
                fontWeight: "bold",
                border: "none",
                outline: "none",
                textDecoration: "underline",
              }}
            />
          ) : (
            <Heading
              onClick={handleTaskClick}
              style={{
                cursor: "pointer",
                fontSize: "40px",
                fontWeight: "bold",
                border: "none",
                outline: "none",
                color: "#37352F",
              }}
            >
              {taskName}
            </Heading>
          )}

          {isEditingTable ? (
            <input
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              onBlur={handleTableBlur} // Handle when input loses focus
              autoFocus // Automatically focus on the input when editing starts
              style={{
                fontSize: "16px",
                fontWeight: "400",
                border: "none",
                outline: "none",
                textDecoration: "underline",
              }}
            />
          ) : (
            <Heading
              onClick={handleTableClick}
              style={{
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "450",
                border: "none",
                outline: "none",
                color: "#37352F",
              }}
            >
              {tableName}
            </Heading>
          )}
        </div>
      </div>
      <div className="main">
        <div
          style={{ overflowX: "auto", marginLeft: "auto", marginRight: "auto" }}
          className="table-container"
        >
          <Box p={5}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Table className="notion-table">
                <Droppable
                  droppableId="columns"
                  direction="horizontal"
                  type="COLUMN"
                >
                  {(provided) => (
                    <Thead ref={provided.innerRef} {...provided.droppableProps}>
                      <Tr>
                        <Th
                          borderBottom="0px"
                          justifyContent="flex-end"
                          alignItems="right"
                        >
                          <Flex
                            justifyContent="flex-end"
                            alignItems="center"
                            width="125px"
                            height="32px"
                            paddingRight={"10.5px"}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",

                                gap: "15px",
                              }}
                            >
                              {selectedRows.size > 0 && (
                                <Text
                                  bg="none"
                                  color="gray.300"
                                  cursor="pointer"
                                  width={"15px"}
                                  onClick={handleDeleteSelectedRows}
                                >
                                  <MdDelete
                                    color="gray.300"
                                    style={{ width: "20px", height: "20px" }}
                                  />
                                </Text>
                              )}
                              {selectedRows.size > 0 && (
                                <input
                                  style={{ width: "15px", height: "15px" }}
                                  type="checkbox"
                                  onChange={() => {
                                    handleSelectAllRows();
                                  }}
                                />
                              )}
                            </div>
                          </Flex>
                        </Th>
                        {columns.map((col, index) => (
                          <Draggable
                            key={col.name}
                            draggableId={col.name}
                            index={index}
                          >
                            {(provided) => (
                              <Th
                                key={index}
                                borderColor="gray.200"
                                width={col.width}
                                textColor="gray.400"
                                position="sticky"
                                top="0"
                                zIndex="2"
                                backgroundColor="white"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Flex align="left">
                                  <Popover placement="bottom">
                                    <PopoverTrigger>
                                      <Button
                                        leftIcon={getIconByType(col.dataType)}
                                        bg="none"
                                        textColor="gray.400"
                                      >
                                        {col.name}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      color="gray.400"
                                      borderRadius="lg"
                                      boxShadow="lg"
                                      px={0}
                                      width={"250px"}
                                      minWidth="200px"
                                    >
                                      <PopoverBody>
                                        <VStack
                                          align={"flex-start"}
                                          spacing={2}
                                        >
                                          <HStack
                                            marginTop={2}
                                            fontWeight={"normal"}
                                            py={0}
                                          >
                                            <Button
                                              padding={"0"}
                                              paddingLeft={"5px"}
                                              height={"28px"}
                                            >
                                              {getIconByType(col.dataType)}
                                            </Button>
                                            <Input
                                              defaultValue={col.name}
                                              onBlur={(e) =>
                                                handleChangeColumnName(
                                                  index,
                                                  e.target.value
                                                )
                                              }
                                              onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                  handleChangeColumnName(
                                                    index,
                                                    e.currentTarget.value
                                                  );
                                                }
                                              }}
                                              size="sm"
                                              variant="flushed"
                                              autoFocus
                                            />
                                          </HStack>
                                          <Box mt={4}>
                                            <label
                                              htmlFor="data-type"
                                              style={{ fontSize: "12px" }}
                                            >
                                              data type
                                            </label>
                                            <Select
                                              defaultValue={col.dataType}
                                              onChange={(e) =>
                                                handleChangeColumnType(
                                                  index,
                                                  e.target.value
                                                )
                                              }
                                              size="sm"
                                              variant="flushed"
                                            >
                                              <option value="string">
                                                Text
                                              </option>
                                              <option value="number">
                                                Number
                                              </option>
                                              <option value="date">Date</option>
                                              <option value="select">
                                                {" "}
                                                Select
                                              </option>
                                              <option value="tags">Tag</option>
                                              <option value="status">
                                                Status
                                              </option>
                                              <option value="email">
                                                Email
                                              </option>
                                              <option value="phone">
                                                Phone
                                              </option>
                                              <option value="cnic">CNIC</option>
                                            </Select>
                                          </Box>

                                          <Button
                                            py={0}
                                            my={0}
                                            leftIcon={<FaArrowUp />}
                                            onClick={() =>
                                              sortColumn(index, "asc")
                                            }
                                            size="sm"
                                            variant="ghost"
                                            color="gray.400"
                                            justifyContent="start"
                                            _hover={{ bg: "gray.600" }}
                                          >
                                            <Text fontWeight={"normal"}>
                                              Sort Ascending
                                            </Text>
                                          </Button>
                                          <Button
                                            py={0}
                                            my={0}
                                            leftIcon={<FaArrowDown />}
                                            onClick={() =>
                                              sortColumn(index, "desc")
                                            }
                                            size="sm"
                                            variant="ghost"
                                            color="gray.400"
                                            justifyContent="start"
                                            _hover={{ bg: "gray.600" }}
                                          >
                                            <Text fontWeight={"normal"}>
                                              Sort Descending
                                            </Text>
                                          </Button>

                                          <InputGroup mb={2}>
                                            <InputLeftElement
                                              pointerEvents="none"
                                              fontSize={"12px"}
                                              height={"28px"}
                                            >
                                              <FaSearch color="gray.300" />
                                            </InputLeftElement>
                                            <Input
                                              fontSize={"14px"}
                                              px={2}
                                              height={"28px"}
                                              type="tel"
                                              placeholder="Search"
                                            />
                                          </InputGroup>
                                          <HStack
                                            justifyContent={"space-between"}
                                            fontSize={"14px"}
                                            fontWeight={"normal"}
                                            ml={4}
                                          >
                                            <Text textTransform={"capitalize"}>
                                              Wrap Column
                                            </Text>
                                            <Switch colorScheme="teal" />
                                          </HStack>
                                          <Button
                                            leftIcon={<MdDelete />}
                                            color="red.400"
                                            fontSize={"15px"}
                                            fontWeight={"normal"}
                                            marginTop={0}
                                            size="sm"
                                            variant="ghost"
                                            justifyContent="start"
                                            _hover={{ color: "red.500" }}
                                            onClick={openAlertDialog}
                                          >
                                            {" "}
                                            <Text>Delete Property</Text>{" "}
                                          </Button>
                                        </VStack>
                                      </PopoverBody>
                                    </PopoverContent>
                                    <AlertDialog
                                      isOpen={isAlertOpen}
                                      leastDestructiveRef={cancelRef}
                                      onClose={closeAlertDialog}
                                    >
                                      <AlertDialogOverlay>
                                        <AlertDialogContent>
                                          <AlertDialogHeader
                                            fontSize="lg"
                                            fontWeight="bold"
                                          >
                                            Confirm Deletion
                                          </AlertDialogHeader>

                                          <AlertDialogBody>
                                            Are you sure you want to delete this
                                            column? This action cannot be
                                            undone.
                                          </AlertDialogBody>

                                          <AlertDialogFooter>
                                            <Button
                                              ref={cancelRef}
                                              onClick={closeAlertDialog}
                                            >
                                              Cancel
                                            </Button>
                                            <Button
                                              colorScheme="red"
                                              onClick={() =>
                                                confirmDelete(col.name)
                                              }
                                              ml={3}
                                            >
                                              Delete
                                            </Button>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialogOverlay>
                                    </AlertDialog>
                                  </Popover>

                                  <Box
                                    onMouseDown={handleMouseDown(index)}
                                    cursor="ew-resize"
                                    width="10px"
                                    height="100%"
                                    position="absolute"
                                    right="0"
                                    top="0"
                                    zIndex="1"
                                  />
                                </Flex>
                              </Th>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        <Th>
                          <Popover
                            placement="bottom"
                            isOpen={isOpen}
                            onClose={onClose}
                          >
                            <PopoverTrigger>
                              <Button
                                onClick={() => onOpen()}
                                leftIcon={<FaPlus />}
                                textColor="gray.400"
                                bg="none"
                              />
                            </PopoverTrigger>
                            <PopoverContent style={{ width: "150px" }}>
                              <PopoverArrow />

                              <PopoverBody overflowY={"auto"} height={"250px"}>
                                <div>
                                  <Tr>
                                    <Button
                                      onClick={() => {
                                        setNewColumnType("string");
                                        setNewColumnName("Text");
                                        handleAddColumn("string", "Text"); // Add the column when button is clicked
                                      }}
                                      bg="none"
                                      color="gray.500"
                                      paddingLeft={0}
                                    >
                                      <GrTextAlignFull
                                        style={{ marginRight: "5px" }}
                                      />{" "}
                                      Text
                                    </Button>
                                  </Tr>
                                  <Tr>
                                    <Button
                                      onClick={() => {
                                        setNewColumnType("number");
                                        setNewColumnName("Number");
                                        handleAddColumn("number", "Number"); // Add the column when button is clicked
                                      }}
                                      bg="none"
                                      color="gray.500"
                                      paddingLeft={0}
                                    >
                                      <MdNumbers
                                        style={{ marginRight: "5px" }}
                                      />{" "}
                                      Number
                                    </Button>
                                  </Tr>
                                  <Tr>
                                    <Button
                                      onClick={() => {
                                        setNewColumnType("phone");
                                        setNewColumnName("Phone");
                                        handleAddColumn("phone", "Phone"); // Add the column when button is clicked
                                      }}
                                      bg="none"
                                      color="gray.500"
                                      paddingLeft={0}
                                    >
                                      <LuPhone style={{ marginRight: "5px" }} />{" "}
                                      Phone
                                    </Button>
                                  </Tr>
                                  <Tr>
                                    <Button
                                      onClick={() => {
                                        setNewColumnType("email");
                                        setNewColumnName("Email");
                                        handleAddColumn("email", "Email"); // Add the column when button is clicked
                                      }}
                                      bg="none"
                                      color="gray.500"
                                      paddingLeft={0}
                                    >
                                      <MdOutlineEmail
                                        style={{ marginRight: "5px" }}
                                      />{" "}
                                      Email
                                    </Button>
                                  </Tr>
                                  <Tr>
                                    <Button
                                      onClick={() => {
                                        setNewColumnType("cnic");
                                        setNewColumnName("CNIC");
                                        handleAddColumn("cnic", "CNIC"); // Add the column when button is clicked
                                      }}
                                      bg="none"
                                      color="gray.500"
                                      paddingLeft={0}
                                    >
                                      <FaRegIdCard
                                        style={{ marginRight: "5px" }}
                                      />{" "}
                                      CNIC
                                    </Button>
                                  </Tr>
                                  <Tr>
                                    <Button
                                      onClick={() => {
                                        setNewColumnType("date");
                                        setNewColumnName("Date");
                                        handleAddColumn("date", "Date"); // Add the column when button is clicked
                                      }}
                                      bg="none"
                                      color="gray.500"
                                      paddingLeft={0}
                                    >
                                      <BsCalendarDate
                                        style={{ marginRight: "5px" }}
                                      />{" "}
                                      Date
                                    </Button>
                                  </Tr>
                                  <Tr>
                                    <Button
                                      onClick={() => {
                                        setNewColumnType("select");
                                        setNewColumnName("Select");
                                        handleAddColumn("select", "Select"); // Add the column when button is clicked
                                      }}
                                      bg="none"
                                      color="gray.500"
                                      paddingLeft={0}
                                    >
                                      <GoSingleSelect
                                        style={{ marginRight: "5px" }}
                                      />{" "}
                                      Select
                                    </Button>
                                  </Tr>
                                  <Tr>
                                    <Button
                                      onClick={() => {
                                        setNewColumnType("tags");
                                        setNewColumnName("Multi-Select");
                                        handleAddColumn("tags", "Multi-Select"); // Add the column when button is clicked
                                      }}
                                      bg="none"
                                      color="gray.500"
                                      paddingLeft={0}
                                    >
                                      <GoTag style={{ marginRight: "5px" }} />{" "}
                                      Multi-Select
                                    </Button>
                                  </Tr>
                                  <Tr>
                                    <Button
                                      onClick={() => {
                                        setNewColumnType("status");
                                        setNewColumnName("Status");
                                        handleAddColumn("status", "Status"); // Add the column when button is clicked
                                      }}
                                      bg="none"
                                      color="gray.500"
                                      paddingLeft={0}
                                    >
                                      <TfiShine
                                        style={{ marginRight: "5px" }}
                                      />{" "}
                                      Status
                                    </Button>
                                  </Tr>
                                </div>
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                        </Th>
                      </Tr>
                    </Thead>
                  )}
                </Droppable>
                <Droppable droppableId="rows" type="ROW">
                  {(provided) => (
                    <Tbody ref={provided.innerRef} {...provided.droppableProps}>
                      {rows.map((row, rowIndex) => (
                        <Draggable
                          key={row.id}
                          draggableId={rowIndex.toString()}
                          index={rowIndex}
                        >
                          {(provided) => (
                            <Tr
                              key={rowIndex}
                              onMouseEnter={() => setHoveredRowIndex(rowIndex)}
                              onMouseLeave={() => setHoveredRowIndex(null)}
                            >
                              <Td
                                borderBottom="0px"
                                width="125px"
                                height="32px"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Flex
                                  justifyContent="flex-end"
                                  alignItems="center"
                                  width="125px"
                                  height="32px"
                                  paddingRight={"10.5px"}
                                >
                                  {hoveredRowIndex === rowIndex && (
                                    <>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          paddingRight: "10px",
                                          gap: "8px",
                                        }}
                                      >
                                        {selectedRows.size <= 0 && (
                                          <Text
                                            bg="none"
                                            color="gray.300"
                                            cursor="pointer"
                                            width={"15px"}
                                            onClick={() =>
                                              handleDeleteRow(rowIndex)
                                            }
                                          >
                                            <MdDelete
                                              color="gray.300"
                                              style={{
                                                width: "20px",
                                                height: "20px",
                                              }}
                                            />
                                          </Text>
                                        )}
                                        <Text
                                          bg="none"
                                          color="gray.300"
                                          cursor="pointer"
                                          onClick={() =>
                                            handleAddRowUnder(rowIndex)
                                          }
                                        >
                                          {" "}
                                          <FaPlus
                                            style={{
                                              width: "20px",
                                              height: "20px",
                                            }}
                                          />{" "}
                                        </Text>

                                        <MdDragIndicator
                                          style={{
                                            width: "20px",
                                            height: "20px",
                                          }}
                                        />

                                        {selectedRows.size <= 0 && (
                                          <input
                                            style={{
                                              width: "15px",
                                              height: "15px",
                                            }}
                                            type="checkbox"
                                            checked={selectedRows.has(rowIndex)}
                                            onChange={() => {
                                              handleSelectRow(rowIndex);
                                            }}
                                          />
                                        )}
                                      </div>
                                    </>
                                  )}
                                  {selectedRows.size > 0 && (
                                    <input
                                      style={{ width: "15px", height: "15px" }}
                                      type="checkbox"
                                      checked={selectedRows.has(rowIndex)}
                                      onChange={() => {
                                        handleSelectRow(rowIndex);
                                        setHoveredRowIndex(null); // Clear hover state when checkbox is clicked
                                      }}
                                      onMouseEnter={() =>
                                        setHoveredRowIndex(null)
                                      }
                                    />
                                  )}
                                </Flex>
                              </Td>

                              {columns.map((col, colIndex) => (
                                <Td
                                  key={colIndex}
                                  borderRight="1px"
                                  borderColor="gray.200"
                                  width="199px"
                                  height="32px"
                                  textColor="gray.600"
                                  fontWeight="medium"
                                >
                                  {renderInputField(
                                    row,
                                    col,
                                    rowIndex,
                                    colIndex
                                  )}
                                </Td>
                              ))}
                              <Td></Td>
                            </Tr>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {/* Add Row Button */}
                      <Tr>
                        <Td borderBottom="0px" borderTop="0px"></Td>
                        <div
                          style={{
                            position: "sticky",
                            left: 0,
                            zIndex: 2,
                            backgroundColor: "white",
                          }}
                        >
                          <Box>
                            <Button
                              leftIcon={<FaPlus />}
                              onClick={handleAddRow}
                              colorScheme="gray"
                              bg="none"
                              fontWeight="normal"
                              borderRadius={0}
                              borderColor="gray.200"
                              justifyContent="left"
                              textColor="gray.400"
                              textAlign="left"
                            >
                              Add Row
                            </Button>
                          </Box>
                        </div>
                      </Tr>
                      {/* Row Count */}
                      <Tr>
                        <Td borderBottom="0px" borderTop="0px"></Td>
                        {columns.map((_, colmIndex) => (
                          <Td
                            key={colmIndex}
                            borderBottom="0px"
                            borderTop="1px"
                            borderColor="gray.200"
                          >
                            <Box
                              fontWeight="normal"
                              textAlign="right"
                              textColor="gray.400"
                              display="flex"
                              justifyContent="end"
                              alignContent="center"
                            >
                              <p
                                style={{
                                  marginRight: "5px",
                                  fontSize: "10px",
                                  alignItems: "center",
                                }}
                              >
                                COUNT
                              </p>
                              {rows.length}
                            </Box>
                          </Td>
                        ))}
                        <Td
                          borderBottom="0px"
                          borderTop="1px"
                          borderColor="gray.200"
                        ></Td>
                      </Tr>
                    </Tbody>
                  )}
                </Droppable>
              </Table>
            </DragDropContext>
          </Box>
        </div>
      </div>
    </>
  );
};

export default NotionTable;
