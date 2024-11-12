import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { MdDelete, MdDragIndicator } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';

interface RowActionsProps {
  rowIndex: number;
  selectedRows: Set<number>;
  hoveredRowIndex: number | null;
  handleDeleteRow: (rowIndex: number) => void;
  handleAddRowUnder: (rowIndex: number) => void;
  handleSelectRow: (rowIndex: number) => void;
  setHoveredRowIndex: (index: number | null) => void;
}

const RowActions: React.FC<RowActionsProps> = ({
  rowIndex,
  selectedRows,
  hoveredRowIndex,
  handleDeleteRow,
  handleAddRowUnder,
  handleSelectRow,
  setHoveredRowIndex,
}) => {
  const isHovered = hoveredRowIndex === rowIndex;
  const isSelected = selectedRows.has(rowIndex);

  return (
    <Flex
      justifyContent="flex-end"
      alignItems="center"
      width="125px"
      height="32px"
      paddingRight="10.5px"
    >
      {isHovered && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingRight: '10px',
            gap: '8px',
          }}
        >
          {selectedRows.size <= 0 && (
            <Text
              bg="none"
              color="gray.300"
              cursor="pointer"
              width="15px"
              onClick={() => handleDeleteRow(rowIndex)}
            >
              <MdDelete
                color="gray.300"
                style={{ width: '20px', height: '20px' }}
              />
            </Text>
          )}
          <Text
            bg="none"
            color="gray.300"
            cursor="pointer"
            onClick={() => handleAddRowUnder(rowIndex)}
          >
            <FaPlus style={{ width: '20px', height: '20px' }} />
          </Text>

          <MdDragIndicator style={{ width: '20px', height: '20px' }} />

          {selectedRows.size <= 0 && (
            <input
              style={{ width: '15px', height: '15px' }}
              type="checkbox"
              checked={isSelected}
              onChange={() => handleSelectRow(rowIndex)}
            />
          )}
        </div>
      )}
      {selectedRows.size > 0 && (
        <input
          style={{ width: '15px', height: '15px' }}
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            handleSelectRow(rowIndex);
            setHoveredRowIndex(null); // Clear hover state when checkbox is clicked
          }}
          onMouseEnter={() => setHoveredRowIndex(null)}
        />
      )}
    </Flex>
  );
};

export default RowActions;
