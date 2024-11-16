import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Box,
  Flex,
  Badge,
  useToast,
  Text,
} from "@chakra-ui/react";
import { GrStatusGood } from "react-icons/gr";
import { useColorMode } from "@chakra-ui/react";

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
  const { colorMode } = useColorMode();
  const [currentStatus, setCurrentStatus] = useState<string>(() => {
    const storedStatus = localStorage.getItem(`${rowIndex}_${col.name}`);
    if (storedStatus) {
      return storedStatus; // Return value from localStorage if it exists
    }
    return row[col.name] || "Inactive"; // Fallback to row data or "Inactive"
  });

  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const handleStatusChange = (newStatus: string) => {
    try {
      setCurrentStatus(newStatus);
      row[col.name] = newStatus;
      localStorage.setItem(`${rowIndex}_${col.name}`, newStatus); // Save to localStorage
      setError(null);
      toast({
        title: "Status Updated",
        description: `The status was successfully updated to ${newStatus}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update the status. Please try again.");
      toast({
        title: "Error",
        description: "Failed to update the status. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    // Update the localStorage whenever the status changes
    if (currentStatus) {
      localStorage.setItem(`${rowIndex}_${col.name}`, currentStatus);
    }
  }, [currentStatus, rowIndex, col.name]);

  return (
    <Popover
      isOpen={tagPopoverRow?.rowIndex === rowIndex && tagPopoverRow?.colName === col.name}
      onClose={() => setTagPopoverRow(null)}
      placement="bottom-start"
    >
      <PopoverTrigger>
        <Box
          cursor="pointer"
          minHeight="20px"
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          borderRadius="8px"
          padding="8px"
          bg={colorMode === "light" ? "white" : "#1a202c"}
          onClick={() => setTagPopoverRow({ rowIndex, colName: col.name })}
        >
          <Badge
            colorScheme={currentStatus === "Active" ? "green" : "red"}
            borderRadius="full"
            padding="4px 8px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <GrStatusGood
              style={{
                marginRight: "8px",
                color: currentStatus === "Active" ? "green" : "red",
              }}
            />
            {currentStatus}
          </Badge>
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
        bg={colorMode === "light" ? "white" : "#1a202c"}
      >
        <PopoverArrow />
        <PopoverBody padding="5px">
          <Flex direction="column" gap="8px">
            <Badge
              onClick={() => handleStatusChange("Active")}
              colorScheme="green"
              cursor="pointer"
              borderRadius="full"
              padding="4px 8px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <GrStatusGood style={{ marginRight: "8px", color: "green" }} />
              Active
            </Badge>
            <Badge
              onClick={() => handleStatusChange("Inactive")}
              colorScheme="red"
              cursor="pointer"
              borderRadius="full"
              padding="4px 8px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <GrStatusGood style={{ marginRight: "8px", color: "red" }} />
              Inactive
            </Badge>
          </Flex>
          {error && (
            <Text color="red.500" fontSize="sm" mt="2">
              {error}
            </Text>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default StatusPopover;
