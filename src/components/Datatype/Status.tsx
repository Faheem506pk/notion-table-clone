import React from 'react';
import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody, Box, Flex, Button } from '@chakra-ui/react';
import { GrStatusGood } from 'react-icons/gr';

interface StatusPopoverProps {
  rowIndex: number;
  currentStatus: string;
  handleStatusChange: (status: string) => void;
  tagPopoverRow: { rowIndex: number; colName: string } | null;
  setTagPopoverRow: React.Dispatch<React.SetStateAction<{ rowIndex: number; colName: string } | null>>;
  colName: string;
}

const StatusPopover: React.FC<StatusPopoverProps> = ({
  rowIndex,
  currentStatus,
  handleStatusChange,
  tagPopoverRow,
  setTagPopoverRow,
  colName,
}) => {
  return (
    <Popover
      isOpen={tagPopoverRow?.rowIndex === rowIndex && tagPopoverRow?.colName === colName}
      onClose={() => setTagPopoverRow(null)}
      placement="bottom-start"
    >
      <PopoverTrigger>
        <Box
          onClick={() => setTagPopoverRow({ rowIndex, colName })}
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
          <span style={{ display: 'flex', alignItems: 'center' }}>
            {currentStatus === 'Active' ? (
              <GrStatusGood style={{ marginRight: '8px', color: 'green' }} />
            ) : (
              <GrStatusGood style={{ marginRight: '8px', color: 'red' }} />
            )}
            {currentStatus}
          </span>
        </Box>
      </PopoverTrigger>

      <PopoverContent
        width={'150px'}
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
              onClick={() => handleStatusChange('Active')}
              colorScheme="green"
              variant="outline"
              size="sm"
            >
              <GrStatusGood style={{ marginRight: '8px', color: 'green' }} />
              Set Active
            </Button>
            <Button
              onClick={() => handleStatusChange('Inactive')}
              colorScheme="red"
              variant="outline"
              size="sm"
            >
              <GrStatusGood style={{ marginRight: '8px', color: 'red' }} />
              Set Inactive
            </Button>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default StatusPopover;
