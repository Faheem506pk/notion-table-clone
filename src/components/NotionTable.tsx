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
  PopoverFooter,
  useDisclosure,
  PopoverArrow,
  Heading,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { VscListFlat } from "react-icons/vsc";
import { MdDeleteOutline } from "react-icons/md";
import { MdNumbers } from "react-icons/md";
import { GrTextAlignFull } from "react-icons/gr";
import { GoSingleSelect } from "react-icons/go";
import { BsCalendarDate } from "react-icons/bs";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [isEditingTable, setIsEditingTable] = useState(false);
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const [newColumnName, setNewColumnName] = useState<string>("");
  const [newColumnType, setNewColumnType] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectOptions, setSelectOptions] = useState<string[]>(() => {
    // Retrieve options from localStorage on initial render
    const savedOptions = localStorage.getItem("selectOptions");
    return savedOptions ? JSON.parse(savedOptions) : [""];
  });

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
        ];
  });

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
      // Create a new column object
      const newColumn: Column = {
        name: name,
        dataType: type,
        width: 150, // Default width for the new column
      };

      // Update the columns state by adding the new column
      setColumns((prevColumns) => [...prevColumns, newColumn]);

      // Update each row to include the new column with a default value
      setRows((prevRows) =>
        prevRows.map((row) => ({
          ...row,
          [name]: type === "select" ? "" : "", // Set default value for new column
        }))
      );

      // Reset the column name and type for future additions
      setNewColumnName(""); // No need to reset since we're passing new names directly
      setNewColumnType("string"); // Reset to default type if needed
      onClose(); // Close the popover
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
          case "ArrowRight":
            e.preventDefault(); // Prevent default arrow key behavior
            if (colIndex + 1 < columns.length) {
              // Move to the next cell in the same row
              setEditingCell({ rowIndex, colIndex: colIndex + 1 });
            } else if (rowIndex + 1 < rows.length) {
              // Move to the first cell in the next row
              setEditingCell({ rowIndex: rowIndex + 1, colIndex: 0 });
            }
            break;
          case "ArrowLeft":
            e.preventDefault();
            if (colIndex > 0) {
              // Move to the previous cell in the same row
              setEditingCell({ rowIndex, colIndex: colIndex - 1 });
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
              <Droppable droppableId="columns" direction="horizontal" type="COLUMN">
              {(provided) => (
                <Thead ref={provided.innerRef} {...provided.droppableProps}>
                  <Tr>
                    <Th borderBottom="0px"></Th>
                    {columns.map((col, index) => (

                      <Draggable key={col.name} draggableId={col.name} index={index}>
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
                            <PopoverContent style={{ width: "150px" }}>
                              <PopoverArrow />
                              <PopoverBody>
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
                              </PopoverBody>
                              <PopoverFooter
                                display="flex"
                                justifyContent="flex-start"
                              >
                                <Button
                                  onClick={() => handleDeleteColumn(col.name)}
                                  bg="none"
                                  color="gray.500"
                                  paddingLeft={0}
                                >
                                  Delete
                                </Button>
                              </PopoverFooter>
                            </PopoverContent>
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

                          <PopoverBody>
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
                                  <MdNumbers style={{ marginRight: "5px" }} />{" "}
                                  Number
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
                        <Draggable key={row.id} draggableId={rowIndex.toString()} index={rowIndex} >
                          {(provided) => {
                            
                            return (
                            <Tr
                              key={rowIndex}
                              onMouseEnter={() => setHoveredRowIndex(rowIndex)}
                              onMouseLeave={() => setHoveredRowIndex(null)}
                              ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                            >
                              <Td
                                borderBottom="0px"
                                width="125px"
                                height="32px"
                              >
                                <Flex
                                  justifyContent="flex-end"
                                  alignItems="right"
                                  width="125px"
                                  height="32px"
                                >
                                  {hoveredRowIndex === rowIndex && (
                                    <>
                                      <Button
                                        onClick={() =>
                                          handleAddRowUnder(rowIndex)
                                        }
                                        bg="none"
                                        color="gray.400"
                                        height="32px"
                                      >
                                        <FaPlus />
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          handleDeleteRow(rowIndex)
                                        }
                                        bg="none"
                                        color="gray.400"
                                        height="32px"
                                      >
                                        <MdDeleteOutline />
                                      </Button>
                                    </>
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
                            );
                          }}
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
                                COUNT{" "}
                              </p>{" "}
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
