import React, { useState } from "react";
import {
  Box,
  Flex,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
  useToast,
} from "@chakra-ui/react";
import TagsInput from "react-tagsinput"; 
import { useLocalStorage } from "../../hooks/useLocalStorage"; 

interface Row {
  [key: string]: any;
}

interface TagPopoverProps {
  rowIndex: number;
  col: { name: string };
  row: Row;
  rows: Row[];
  setRows: React.Dispatch<React.SetStateAction<Row[]>>;
}

const MultiSelect: React.FC<TagPopoverProps> = ({
  rowIndex,
  col,
  row,
  rows,
  setRows,
}) => {
  const [tagPopoverRow, setTagPopoverRow] = useState<{
    rowIndex: number;
    colName: string;
  } | null>(null);

  const [storedRows, setStoredRows] = useLocalStorage<Row[]>("rows", rows);
  const [badgeColors, setBadgeColors] = useLocalStorage<Record<string, string>>(
    "badgeColors",
    {}
  );
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

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
    try {
      if (!badgeColors[tag]) {
        const newColor =
          tagColorSchemes[Math.floor(Math.random() * tagColorSchemes.length)];
        setBadgeColors((prevColors) => ({
          ...prevColors,
          [tag]: newColor,
        }));
        return newColor;
      }
      return badgeColors[tag];
    } catch (err) {
      console.error("Error assigning color scheme to tag:", err);
      setError("Failed to assign a color scheme to the tag.");
      toast({
        title: "Error",
        description: "Failed to assign a color scheme to the tag.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return "gray"; // Default color if an error occurs
    }
  };

  const handleTagsInputChange = (
    rowIndex: number,
    colName: string,
    tags: string[]
  ) => {
    try {
      const updatedRows = [...storedRows];
      const updatedRow = { ...updatedRows[rowIndex] };
      updatedRow[colName] = tags.join(",");
      updatedRows[rowIndex] = updatedRow;

      setStoredRows(updatedRows);
      setRows(updatedRows);
      setError(null); // Clear any previous errors
      toast({
        title: "Tags Updated",
        description: "The tags were successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Error updating tags:", err);
      setError("Failed to update the tags. Please try again.");
      toast({
        title: "Error",
        description: "Failed to update the tags. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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
        >
          <Flex wrap="wrap" gap="4px">
            {row[col.name]
              ?.toString()
              .split(",")
              .filter((tag: string) => tag)
              .map((tag: string, i: React.Key) => (
                <Badge
                  padding={1}
                  borderRadius={4}
                  key={i}
                  colorScheme={badgeColors[tag] || getRandomColorScheme(tag)}
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
          {error && (
            <Text color="red.500" fontSize="sm" mb="2">
              {error}
            </Text>
          )}
          <TagsInput
            value={row[col.name]?.toString().split(",").filter(Boolean) || []}
            onChange={(tags) => handleTagsInputChange(rowIndex, col.name, tags)}
            inputProps={{
              placeholder: "Add tags",
              autoFocus: true,
              style: { backgroundColor: "gray.200", borderRadius: "18px" },
            }}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelect;
