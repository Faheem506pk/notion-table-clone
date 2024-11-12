import React, { useEffect, useState } from 'react';
import { Box, Flex, Badge, Popover, PopoverTrigger, PopoverContent, PopoverBody } from '@chakra-ui/react';
import TagsInput from 'react-tagsinput'; // Assuming you have the TagsInput component imported


interface Row {
    [key: string]: any;
  }
interface TagPopoverProps {
    rowIndex: number; // The index of the current row
    col: { name: string }; // Column object with a 'name' property
    row: { [key: string]: any }; // Row object where keys are column names and values are the data for those columns
    setRows: React.Dispatch<React.SetStateAction<Row[]>>; // Correct typing for the setter function to handle an array of Row
    handleTagsInputChange: (rowIndex: number, colName: string, tags: string[]) => void; // Function to handle changes in the tags input
  }
  

const MultiSelect: React.FC<TagPopoverProps> = ({
  rowIndex,
  col,
  row,
  setRows,
  handleTagsInputChange
}) => {

    const [tagPopoverRow, setTagPopoverRow] = useState<{
        rowIndex: number;
        colName: string;
      } | null>(null);

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
      isOpen={tagPopoverRow?.rowIndex === rowIndex && tagPopoverRow?.colName === col.name}
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
              style: { backgroundColor: "gray.200", borderRadius: "18px" }
            }}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelect;
