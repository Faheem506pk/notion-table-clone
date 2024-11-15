import React, { useState, useEffect } from 'react';
import { Popover, PopoverTrigger, PopoverContent, PopoverBody, Input, Badge, Button, Box, Flex } from '@chakra-ui/react';
import { MdDragIndicator } from 'react-icons/md';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useLocalStorage } from "../../hooks/useLocalStorage";

interface SelectPopoverProps {
  row: { [key: string]: any };
  col: { name: string };
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectOptions: string[];
  setSelectOptions: React.Dispatch<React.SetStateAction<string[]>>;
}

const SelectPopover: React.FC<SelectPopoverProps> = ({
  row,
  col,
  handleChange,
  selectOptions,
  setSelectOptions
}) => {
  const [newOption, setNewOption] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [badgeColors, setBadgeColors] = useLocalStorage<Record<string, string>>('badgeColors', {});
  const [tagPopoverRow, setTagPopoverRow] = useState<{ rowIndex: number | null, colName: string | null }>({ rowIndex: null, colName: null });
  const [editingOption, setEditingOption] = useState<{
    oldValue: string;
    newValue: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getRandomColorScheme = (tag: string) => {
    // Always return a random color for new tags
    const lightColors = ['#E3F2FD', '#FFEBEE', '#F1F8E9', '#FFF3E0', '#E8F5E9']; // Lighter color palette
    if (!badgeColors[tag]) {
      const newColor = lightColors[Math.floor(Math.random() * lightColors.length)];
      setBadgeColors((prevColors) => ({
        ...prevColors,
        [tag]: newColor,
      }));
      return newColor;
    }
    return badgeColors[tag];
  };

  useEffect(() => {
    try {
      const savedOptions = localStorage.getItem('selectOptions');
      if (savedOptions) {
        setSelectOptions(JSON.parse(savedOptions));
      }
    } catch (e) {
      console.error('Error retrieving options from local storage:', e);
    }
  }, []);

  const handleEditOption = (option: string) => {
    if (editingOption?.oldValue === option) {
      setEditingOption(null); // Exit edit mode if already in edit mode
    } else {
      setEditingOption({ oldValue: option, newValue: option }); // Enter edit mode with the option value
    }
  };

  const handleSaveEdit = () => {
    if (editingOption) {
      const { oldValue, newValue } = editingOption;
      if (!newValue.trim()) {
        setError('Edited option cannot be empty.');
        return;
      }
      if (selectOptions.includes(newValue) && oldValue !== newValue) {
        setError('Duplicate option is not allowed.');
        return;
      }
      setSelectOptions((prev) =>
        prev.map((opt) => (opt === oldValue ? newValue : opt))
      );
      setEditingOption(null);
      setError(null);
    }
  };

  const handleOptionClick = (option: string) => {
    row[col.name] = option; // Update the selected value in the row object
    handleChange({ target: { value: option } } as React.ChangeEvent<HTMLSelectElement>); // Propagate the change to the parent component
    setError(null);
  };

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    if (selectOptions.includes(newOption)) return;
    setSelectOptions((prev) => [...prev, newOption]);
    setNewOption('');
  };

  const handleDeleteOption = (option: string) => {
    setSelectOptions((prev) => prev.filter((opt) => opt !== option));
  };

  return (
    <Popover>
      <PopoverTrigger>
      <Box
  onClick={() => setTagPopoverRow({ rowIndex: row.id, colName: col.name })}
  cursor="pointer"
  minHeight="20px"
  width="100%"
  paddingLeft={"10px"}
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
          bg={badgeColors[tag] || getRandomColorScheme(tag)} 
          color="black" 
          fontWeight="400"
          style={{ textTransform: 'none' }} 
        >
          {tag.trim()}
        </Badge>
      ))}
  </Flex>
</Box>


      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
            <Input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddOption();
                }
              }}
              placeholder="Add new option"
              flex="1"
              mr={2}
              bg="gray.100"
              _hover={{ bg: "gray.200" }}
              border="1px solid"
              borderColor="gray.300"
              borderRadius="md"
            />
          </div>

          <DragDropContext
            onDragEnd={(result) => {
              const { source, destination } = result;
              if (!destination) return;

              const reorderedOptions = Array.from(selectOptions);
              const [movedItem] = reorderedOptions.splice(source.index, 1);
              reorderedOptions.splice(destination.index, 0, movedItem);
              setSelectOptions(reorderedOptions);
            }}
          >
            <Droppable droppableId="options">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} style={{ marginTop: '10px' }}>
                  {selectOptions.map((option, index) => (
                    <Draggable key={option} draggableId={option} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '4px 8px',
                            marginBottom: '4px',
                            ...provided.draggableProps.style,
                          }}
                        >
                          <MdDragIndicator
                            style={{
                              width: '20px',
                              height: '20px',
                              marginRight: '10px',
                              cursor: 'grab',
                            }}
                          />
                          <span
                            onClick={() => handleOptionClick(option)}
                            style={{
                              cursor: 'pointer',
                              flex: '1',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <span
                              style={{
                                fontWeight: "400",
                                backgroundColor: getRandomColorScheme(option),
                                color: 'black',
                                borderRadius: '4px',
                                padding: '2px 6px',
                                marginRight: '8px',
                              }}
                            >
                              {option}
                            </span>
                          </span>
                          <div>
                            {editingOption?.oldValue === option ? (
                              <Button
                                onClick={handleSaveEdit}
                                size="sm"
                                colorScheme="green"
                                marginLeft="5px"
                              >
                                Save
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleEditOption(option)}
                                size="sm"
                                colorScheme="blue"
                                marginLeft="5px"
                              >
                                Edit
                              </Button>
                            )}
                            <Button
                              onClick={() => handleDeleteOption(option)}
                              size="sm"
                              colorScheme="red"
                              marginLeft="5px"
                            >
                              Delete
                            </Button>
                          </div>
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

export default SelectPopover;
