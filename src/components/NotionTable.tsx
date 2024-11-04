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
  PopoverCloseButton,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { VscListFlat } from "react-icons/vsc";
import { MdDeleteOutline } from "react-icons/md";

interface Column {
  name: string;
  dataType: string;
  width: number;
}

interface Row {
  [key: string]: any;
}



 

 
const NotionTable: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(() => {
    const storedColumns = localStorage.getItem("columns");
    return storedColumns
      ? JSON.parse(storedColumns)
      : [
          { name: "Name", dataType: "string", width: 150 },
          { name: "Age", dataType: "number", width: 100 },
          { name: "Date of Birth", dataType: "date", width: 150 },
        ];
  });

  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const handleDeleteRow = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };


  const [rows, setRows] = useState<Row[]>(() => {
    const storedRows = localStorage.getItem("rows");
    return storedRows
      ? JSON.parse(storedRows)
      : [
          { Name: "", Age: null, "Date of Birth": null },
          { Name: "", Age: null, "Date of Birth": null },
          { Name: "", Age: null, "Date of Birth": null },
          { Name: "", Age: null, "Date of Birth": null },
          { Name: "", Age: null, "Date of Birth": null },
        ];
  });

  const [newColumnName, setNewColumnName] = useState<string>("New Column");
  const [newColumnType, setNewColumnType] = useState<string>("string");
  const [editingCell, setEditingCell] =
    useState<{ rowIndex: number; colIndex: number } | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Save rows to local storage
  useEffect(() => {
    localStorage.setItem("rows", JSON.stringify(rows));
  }, [rows]);

  // Save columns to local storage
  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  // Handle mouse down event for resizing
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

  const handleAddColumn = () => {
    if (newColumnName) {
      const newColumn: Column = {
        name: newColumnName,
        dataType: newColumnType,
        width: 150,
      };
      setColumns((prevColumns) => [...prevColumns, newColumn]);
      setNewColumnName("");
      setNewColumnType("string");
      onClose();
    }
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setRows(
        rows.map((r, i) => (i === rowIndex ? { ...r, [col.name]: value } : r))
      );
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const nextColIndex = colIndex + 1 < columns.length ? colIndex + 1 : 0;
        const nextRowIndex = nextColIndex === 0 ? rowIndex + 1 : rowIndex;

        if (nextRowIndex < rows.length) {
          setEditingCell({ rowIndex: nextRowIndex, colIndex: nextColIndex });
        } else {
          setEditingCell(null);
        }
      }
    };

    return isEditing ? (
      <Input
        value={row[col.name] || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        variant="flushed"
        autoFocus
      />
    ) : (
      <Box onClick={handleCellClick} cursor="pointer" padding="2">
        {row[col.name] || ""}
      </Box>
    );
  };

  return (
    <div className="main">
      <Box p={5}>
        <Table className="notion-table">
          <Thead>
            <Tr>
              {columns.map((col, index) => (
                <Th
                  key={index}
                  borderColor="gray.200"
                  width={col.width}
                  textColor="gray.400"
                >
                  <Flex align="left">
                    <Popover placement="bottom">
                      <PopoverTrigger>
                        <Button
                          leftIcon={<VscListFlat />}
                          bg="none"
                          textColor="gray.400"
                        >
                          {col.name}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverBody>
                          <Input
                            defaultValue={col.name}
                            onBlur={(e) =>
                              handleChangeColumnName(index, e.target.value)
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
                        <PopoverFooter display="flex" justifyContent="flex-start">
                          <Button
                            onClick={() => handleDeleteColumn(col.name)}
                            bg="none"
                            color="gray.400"
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
              ))}
              <Th>
                <Popover placement="bottom" isOpen={isOpen} onClose={onClose}>
                  <PopoverTrigger>
                    <Button
                      onClick={() => {
                        setNewColumnName("New Column");
                        onOpen();
                      }}
                      leftIcon={<FaPlus />}
                      textColor="gray.400"
                      bg="none"
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                      <Input
                        placeholder="Column Name"
                        value={newColumnName}
                        onChange={(e) => setNewColumnName(e.target.value)}
                        size="sm"
                        variant="flushed"
                      />
                      <Select
                        value={newColumnType}
                        onChange={(e) => setNewColumnType(e.target.value)}
                        mt={2}
                        size="sm"
                      >
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                      </Select>
                    </PopoverBody>
                    <PopoverFooter display="flex" justifyContent="flex-start">
                      <Button onClick={handleAddColumn}>Add</Button>
                    </PopoverFooter>
                  </PopoverContent>
                </Popover>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((row, rowIndex) => (
              <Tr key={rowIndex} 
              onMouseEnter={() => setHoveredRowIndex(rowIndex)}
              onMouseLeave={() => setHoveredRowIndex(null)} >
                {columns.map((col, colIndex) => (
                  <Td key={colIndex} borderRight="1px" borderColor="gray.200">
                    {renderInputField(row, col, rowIndex, colIndex)}
                  </Td>
                ))}
                <Td>
                {hoveredRowIndex === rowIndex && (
              <Button
                onClick={() => handleDeleteRow(rowIndex)}
                bg="none"
                color="gray.400"
              >
                <MdDeleteOutline />
              </Button>
            )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Box display="flex" justifyContent="flex-start" >
        <Button leftIcon={<FaPlus />} onClick={handleAddRow} colorScheme="gray" size="lg" bg="none" borderTop="1px" borderBottom="1px" borderRadius={0} borderColor="gray.200" width={"full"}  justifyContent="left" textColor="gray.400">
        Add Row
      </Button>
        </Box>
        <Box mt={4} textAlign="left">
          <strong>Row count:</strong> {rows.length}
        </Box>
      </Box>
    </div>
  );
};

export default NotionTable;
