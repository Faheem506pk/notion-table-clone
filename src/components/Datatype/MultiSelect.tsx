import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
} from "@chakra-ui/react";
import TagsInput from "react-tagsinput"; // Assuming you have the TagsInput component imported

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

  const [badgeColors, setBadgeColors] = useState<Record<string, string>>(() => {
    const storedColors = localStorage.getItem("badgeColors");
    return storedColors ? JSON.parse(storedColors) : {};
  });

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
  }, [setRows]);

  return (
    <Popover
      isOpen={
        tagPopoverRow?.rowIndex === rowIndex && tagPopoverRow?.colName === col.name
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
