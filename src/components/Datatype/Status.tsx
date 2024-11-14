import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Box,
  Flex,
  Button,
} from "@chakra-ui/react";
import { GrStatusGood } from "react-icons/gr";
import { useLocalStorage } from "../../hooks/useLocalStorage"; 

interface StatusPopoverProps {
  rowIndex: number;
  col: { name: string };
  row: { [key: string]: any };
}

const StatusPopover: React.FC<StatusPopoverProps> = ({
  rowIndex,
  col,
  row,
}) => {
  const [tagPopoverRow, setTagPopoverRow] = useState<{
    rowIndex: number;
    colName: string;
  } | null>(null);


  const [currentStatus, setCurrentStatus] = useLocalStorage<string>(
    `${rowIndex}_${col.name}`,
    row[col.name] || "Inactive" 
  );

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus); 
    row[col.name] = newStatus; 
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
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          borderRadius="8px"
          padding="8px"
          backgroundColor="white"
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            {currentStatus === "Active" ? (
              <GrStatusGood style={{ marginRight: "8px", color: "green" }} />
            ) : (
              <GrStatusGood style={{ marginRight: "8px", color: "red" }} />
            )}
            {currentStatus}
          </span>
        </Box>
      </PopoverTrigger>

      <PopoverContent
        width={"150px"}
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
              onClick={() => handleStatusChange("Active")}
              colorScheme="green"
              variant="outline"
              size="sm"
            >
              <GrStatusGood style={{ marginRight: "8px", color: "green" }} />
              Set Active
            </Button>
            <Button
              onClick={() => handleStatusChange("Inactive")}
              colorScheme="red"
              variant="outline"
              size="sm"
            >
              <GrStatusGood style={{ marginRight: "8px", color: "red" }} />
              Set Inactive
            </Button>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default StatusPopover;
