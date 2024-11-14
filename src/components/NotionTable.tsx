import React, {useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "react-tagsinput/react-tagsinput.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Header from "./Header";
import RowActions from "./RowActions";
import ColumnPropertyEdit from "./ColumnPropertyEdit";
import AddNewColumn from "./AddNewColumn";
import SelectPopover from "./Datatype/Select";
import MultiSelect from "./Datatype/MultiSelect";
import StatusPopover from "./Datatype/Status";
import EmailPopover from "./Datatype/Email";
import PhonePopover from "./Datatype/Phone";

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

  const sortColumn = (colIndex: number, order: "asc" | "desc") => {
    const sortedRows = [...rows].sort((a, b) => {
      const valA = a[columns[colIndex].name];
      const valB = b[columns[colIndex].name];

      const isEmpty = (value: any) =>
        value == null || (typeof value === "string" && value.trim() === "");

      if (isEmpty(valA) && isEmpty(valB)) return 0;
      if (isEmpty(valA)) return 1;
      if (isEmpty(valB)) return -1;

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

  const renderInputField = (
    row: Row,
    col: Column,
    rowIndex: number,
    colIndex: number
  ) => {
    const isEditing =
      editingCell?.rowIndex === rowIndex && editingCell?.colIndex === colIndex;

    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      if (
        editingCell &&
        editingCell.rowIndex === rowIndex &&
        editingCell.colIndex === colIndex
      ) {
        switch (e.key) {
          case "Enter":
            handleBlur();
            break;
          case "Tab":
            e.preventDefault();
            const isShift = e.shiftKey;
            const nextColIndex = colIndex + (isShift ? -1 : 1);
            let nextRowIndex = rowIndex;

            if (isShift) {
              if (colIndex > 0) {
                setEditingCell({ rowIndex, colIndex: nextColIndex });
              } else if (rowIndex > 0) {
                nextRowIndex--;
                setEditingCell({
                  rowIndex: nextRowIndex,
                  colIndex: columns.length - 1,
                });
              }
            } else {
              if (nextColIndex < columns.length) {
                setEditingCell({ rowIndex, colIndex: nextColIndex });
              } else {
                nextRowIndex++;
                setEditingCell({ rowIndex: nextRowIndex, colIndex: 0 });
              }
            }
            break;
          case "ArrowDown":
            e.preventDefault();
            if (rowIndex + 1 < rows.length) {
              setEditingCell({ rowIndex: rowIndex + 1, colIndex });
            }
            break;
          case "ArrowUp":
            e.preventDefault();
            if (rowIndex > 0) {
              setEditingCell({ rowIndex: rowIndex - 1, colIndex });
            }
            break;
          default:
            break;
        }
      } else {
        e.preventDefault();
      }
    };

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

    if (isEditing) {
      if (col.dataType === "date") {
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
      } else  if (col.dataType === "select") {
        return (
          <SelectPopover
            key={rowIndex}
            row={row}
            col={{ name: "status" }} // Set column name accordingly
            handleChange={handleChange}
            handleBlur={handleBlur}
            handleKeyDown={handleKeyDown}
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
    if (col.dataType === "phone") {
      return (
        <PhonePopover
        key={rowIndex}
        rowIndex={rowIndex}
        col={{ name: "phone" }}
        row={row}
      />
      );
    } else if (col.dataType === "email") {
      return (
        <EmailPopover
        key={rowIndex}
        rowIndex={rowIndex}
        col={{ name: "email" }}
        row={row}
      />
      );
    } else if (col.dataType === "status") {
      return (
        <StatusPopover
          key={rowIndex}
          rowIndex={rowIndex}
          col={{ name: "email" }}
          row={row}
        />
      );
    } else if (col.dataType === "tags") {
      return (
        <MultiSelect
          rowIndex={rowIndex}
          col={{ name: "tags" }}
          row={row}
          rows={rows}
          setRows={setRows}
        />
      );
    }


  };

  const saveToLocalStorage = (key: string, data: Column[] | Row[]): void => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  useEffect(() => {
    localStorage.setItem("rows", JSON.stringify(rows));
  }, [rows]);

  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

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
