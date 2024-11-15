import React, { useState, useEffect } from "react";
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
import { MdDragIndicator } from "react-icons/md";
import TagsInput from "react-tagsinput";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface Row {
  [key: string]: any;
}

interface TagPopoverProps {
  rowIndex: number;
  col: { name: string };
  row: Row;
  rows: Row[];
  setRows: React.Dispatch<React.SetStateAction<Row[]>>;
  tagsOptions: string[];
  setTagsOptions: React.Dispatch<React.SetStateAction<string[]>>;
}

const MultiSelect: React.FC<TagPopoverProps> = ({
  rowIndex,
  col,
  row,
  rows,
  setRows,
  tagsOptions,
  setTagsOptions,
}) => {
  const [tagPopoverRow, setTagPopoverRow] = useState<{
    rowIndex: number;
    colName: string;
  } | null>(null);

  const [badgeColors, setBadgeColors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  useEffect(() => {
    // Get stored badge colors from localStorage on component mount
    const storedBadgeColors = JSON.parse(localStorage.getItem("badgeColorData") || "{}");
    
    // Only update state if there are stored badge colors, otherwise use default
    if (Object.keys(storedBadgeColors).length > 0) {
      setBadgeColors(storedBadgeColors);
    }
  }, []);
  
  useEffect(() => {
    // Only save badge colors to localStorage when they are updated
    if (Object.keys(badgeColors).length > 0) {
      localStorage.setItem("badgeColorData", JSON.stringify(badgeColors));
    }
  }, [badgeColors]);
  
  // Get stored rows and badge colors from localStorage on component mount
  useEffect(() => {
    const storedRows = JSON.parse(localStorage.getItem("rowsData") || "[]");
  
    setRows(storedRows);
   
  }, []);

  // Save rows and badge colors to localStorage
  useEffect(() => {
    localStorage.setItem("rowsData", JSON.stringify(rows));

  }, [rows]);

  const handleOptionClick = (option: string) => {
    const updatedTags = row[col.name]
      ? row[col.name].toString().split(",").filter(Boolean)
      : [];

    // Add the clicked option if it's not already in the tags
    if (!updatedTags.includes(option)) {
      updatedTags.push(option);
      handleTagsInputChange(rowIndex, col.name, updatedTags); // Update tags for the specific cell
    }
  };

  const getRandomColorScheme = (tag: string) => {
    const lightColors = ["#E3F2FD", "#FFEBEE", "#F1F8E9", "#FFF3E0", "#E8F5E9"];
  
    try {
      // Use tag as the unique key for color assignment
      if (!badgeColors[tag]) {
        const newColor =
          lightColors[Math.floor(Math.random() * lightColors.length)];
        setBadgeColors((prevColors) => ({
          ...prevColors,
          [tag]: newColor, // Store color using only the tag as key
        }));
        return newColor;
      }
  
      // Return the stored color if it exists
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
      return "gray"; // Default fallback color
    }
  };

  const handleTagsInputChange = (
    rowIndex: number,
    colName: string,
    tags: string[]
  ) => {
    try {
      const updatedRows = [...rows];
      const updatedRow = { ...updatedRows[rowIndex] };

      // Save the tags for the specific column in the row
      updatedRow[colName] = tags.join(",");
      updatedRows[rowIndex] = updatedRow;

      setRows(updatedRows); // Update state for rendering
      setError(null);

      toast({
        title: "Tags Updated",
        description: "The tags were successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Add new tags to tagsOptions if they don't exist
      tags.forEach((tag) => {
        if (!tagsOptions.includes(tag)) {
          setTagsOptions((prevOptions) => [...prevOptions, tag]);
        }
      });
    } catch (err) {
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
    .map((tag: string, i: number) => (
      <Badge
        padding={1}
        borderRadius={4}
        key={i}
        bg={badgeColors[tag] || getRandomColorScheme(tag)} // Use tag as key
        color="black"
        fontWeight="400"
        style={{ textTransform: "none" }}
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
            onChange={(tags) => {
              handleTagsInputChange(rowIndex, col.name, tags);
            }}
            inputProps={{
              placeholder: "Add tags",
              autoFocus: true,
              style: { backgroundColor: "gray.200", borderRadius: "18px" },
            }}
          />
          <DragDropContext
            onDragEnd={(result) => {
              const { source, destination } = result;
              if (!destination) return;

              const reorderedOptions = Array.from(tagsOptions);
              const [movedItem] = reorderedOptions.splice(source.index, 1);
              reorderedOptions.splice(destination.index, 0, movedItem);
              setTagsOptions(reorderedOptions);
            }}
          >
            <Droppable droppableId="options">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ marginTop: "10px" }}
                >
                  {tagsOptions.map((option, index) => (
                    <Draggable key={option} draggableId={option} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "4px 8px",
                            marginBottom: "4px",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <MdDragIndicator
                            style={{
                              width: "20px",
                              height: "20px",
                              marginRight: "10px",
                              cursor: "move",
                              color: "black",
                            }}
                          />
                          <span
                            onClick={() => handleOptionClick(option)}
                            style={{
                              cursor: "move",
                              fontWeight: "400",
                              color: "black",
                              borderRadius: "4px",
                              padding: "2px 6px",
                              marginRight: "8px",
                              backgroundColor: badgeColors[`${option}`] || getRandomColorScheme(option), // Apply background color here
                            }}
                          >
                            {option}
                          </span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelect;
