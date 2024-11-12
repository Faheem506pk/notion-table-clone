import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
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
  Badge,
  Text,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { MdDelete, MdOutlineEmail } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import { LuPhone } from "react-icons/lu";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Header from "./Header";
import RowActions from "./RowActions";
import ColumnPropertyEdit from "./ColumnPropertyEdit";
import AddNewColumn from "./AddNewColumn";

interface Column {
  name: string;
  dataType: string;
  width: number;
}

interface Row {
  [key: string]: any;
}

const NotionTable: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { onClose } = useDisclosure();
  const [newColumnName, setNewColumnName] = useState<string>("");
  const [newColumnType, setNewColumnType] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
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
    const updatedRows = [...rows];
    const updatedRow = { ...updatedRows[rowIndex] };
    updatedRow[colName] = tags.join(",");
    updatedRows[rowIndex] = updatedRow;

    setRows(updatedRows);

    localStorage.setItem("rows", JSON.stringify(updatedRows));
  };

  const [newOption, setNewOption] = useState<string>("");
  const [editingOption, setEditingOption] = useState<{
    oldValue: string;
    newValue: string;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem("selectOptions", JSON.stringify(selectOptions));
  }, [selectOptions]);

  useEffect(() => {
    if (newColumnName || newColumnType) {
      console.log(`New column name: ${newColumnName}, type: ${newColumnType}`);
    }
  }, [newColumnName, newColumnType]);

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
    if (name) {
      let newName = name;
      let counter = 1;
      while (columns.some((column) => column.name === newName)) {
        newName = `${name}${counter}`;
        counter++;
      }

      const newColumn: Column = {
        name: newName,
        dataType: type,
        width: 150,
      };

      setColumns((prevColumns) => [...prevColumns, newColumn]);

      setRows((prevRows) =>
        prevRows.map((row) => ({
          ...row,
          [newName]: type === "select" ? "" : "",
        }))
      );

      setNewColumnName("");
      setNewColumnType("string");
      onClose();
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
      const reorderedColumns = Array.from(columns);
      const [movedColumn] = reorderedColumns.splice(source.index, 1);
      reorderedColumns.splice(destination.index, 0, movedColumn);
      setColumns(reorderedColumns);
      saveToLocalStorage("columns", reorderedColumns);
    } else {
      const reorderedRows = Array.from(rows);
      const [movedRow] = reorderedRows.splice(source.index, 1);
      reorderedRows.splice(destination.index, 0, movedRow);
      setRows(reorderedRows);
      saveToLocalStorage("rows", reorderedRows);
    }
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
      } else if (col.dataType === "phone") {
        // Get the saved Phone  from localStorage or fallback to the current row value
        const savedPhone = localStorage.getItem(`${rowIndex}_${col.name}`);
        const currentPhone = savedPhone || row[col.name] || ""; // Default to empty string if no value exists

        const handleEmailChange = (newPhone: string) => {
          // Save the new Phone  to localStorage only after the change
          localStorage.setItem(`${rowIndex}_${col.name}`, newPhone);

          // Update the row with the new email value
          row[col.name] = newPhone;
        };

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
                onClick={() =>
                  setTagPopoverRow({ rowIndex, colName: col.name })
                }
                cursor="pointer"
                minHeight="20px"
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                borderRadius="8px"
                padding="8px"
              >
                <span>{currentPhone}</span>
              </Box>
            </PopoverTrigger>

            <PopoverContent
              width={"250px"}
              color="gray"
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
                  {/* Email input */}
                  <Input
                    type="number"
                    defaultValue={currentPhone}
                    onBlur={(e) => handleEmailChange(e.target.value)} // Update when user clicks out (on blur)
                    placeholder="Enter Phone Number"
                    size="sm"
                    mb="4px"
                  />
                  {/* Button to redirect to Phone  */}
                  <Button
                    onClick={() =>
                      (window.location.href = `tel:${currentPhone}`)
                    }
                    colorScheme="green"
                    variant="outline"
                    size="sm"
                  >
                    <LuPhone style={{ width: "17px", height: "17px" }} />
                  </Button>
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </Popover>
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

    if (col.dataType === "email") {
      const savedEmail = localStorage.getItem(`${rowIndex}_${col.name}`);
      const currentEmail = savedEmail || row[col.name] || "";

      const handleEmailChange = (newEmail: string) => {
        localStorage.setItem(`${rowIndex}_${col.name}`, newEmail);

        row[col.name] = newEmail;
      };

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
            >
              <span>{currentEmail}</span>
            </Box>
          </PopoverTrigger>

          <PopoverContent
            width={"250px"}
            color="gray"
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
                <Input
                  type="email"
                  defaultValue={currentEmail}
                  onBlur={(e) => handleEmailChange(e.target.value)}
                  placeholder="Enter email"
                  size="sm"
                  mb="4px"
                />

                <Button
                  onClick={() =>
                    (window.location.href = `mailto:${currentEmail}`)
                  }
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                >
                  <MdOutlineEmail style={{ width: "17px", height: "17px" }} />
                </Button>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      );
    }

    if (col.dataType === "status") {
      const handleStatusChange = (newStatus: string) => {
        localStorage.setItem(`${rowIndex}_${col.name}`, newStatus);

        row[col.name] = newStatus;
      };

      const savedStatus = localStorage.getItem(`${rowIndex}_${col.name}`);
      const currentStatus = savedStatus || row[col.name] || "Inactive";

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

      const isEmpty = (value: any) =>
        value == null || (typeof value === "string" && value.trim() === "");

      if (isEmpty(valA) && isEmpty(valB)) return 0;
      if (isEmpty(valA)) return 1;
      if (isEmpty(valB)) return -1;

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
      <Header />

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
                    <Thead
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      bg="none"
                    >
                      <Tr>
                        <Th
                          borderBottom="0px"
                          justifyContent="flex-end"
                          alignItems="right"
                          bg="none"
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
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                bg="none"
                              >
                                <ColumnPropertyEdit
                                  key={index}
                                  col={col}
                                  index={index}
                                  handleChangeColumnName={
                                    handleChangeColumnName
                                  }
                                  handleChangeColumnType={
                                    handleChangeColumnType
                                  }
                                  sortColumn={sortColumn}
                                  handleDeleteColumn={handleDeleteColumn}
                                  handleMouseDown={handleMouseDown}
                                />
                              </Th>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        <Th bg="none">
                          <AddNewColumn
                            onOpen={() => setIsOpen(true)}
                            isOpen={isOpen}
                            onClose={() => setIsOpen(false)}
                            setNewColumnType={setNewColumnType}
                            setNewColumnName={setNewColumnName}
                            handleAddColumn={handleAddColumn}
                          />
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
                                <RowActions
                                  rowIndex={rowIndex}
                                  selectedRows={selectedRows}
                                  hoveredRowIndex={hoveredRowIndex}
                                  handleDeleteRow={handleDeleteRow}
                                  handleAddRowUnder={handleAddRowUnder}
                                  handleSelectRow={handleSelectRow}
                                  setHoveredRowIndex={setHoveredRowIndex}
                                />
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

                      <Tr>
                        <Td borderBottom="0px" borderTop="0px"></Td>
                        <div
                          style={{
                            position: "sticky",
                            left: 0,
                            zIndex: 2,
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
