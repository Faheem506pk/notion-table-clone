import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Box,
  Input,
  Button,
  Flex,
} from "@chakra-ui/react";
import { LuPhone } from "react-icons/lu";

interface PhonePopoverProps {
  rowIndex: number;
  col: { name: string }; 
  row: { [key: string]: any };
}

const PhonePopover: React.FC<PhonePopoverProps> = ({
  rowIndex,
  col,
  row,
}) => {
    const [tagPopoverRow, setTagPopoverRow] = useState<{
        rowIndex: number;
        colName: string;
      } | null>(null);
      const savedPhone = localStorage.getItem(`${rowIndex}_${col.name}`);
      const currentPhone = savedPhone || row[col.name] || ""; // Default to empty string if no value exists

    const handlePhoneChange = (newPhone: string) => {
        // Save the new Phone  to localStorage only after the change
        localStorage.setItem(`${rowIndex}_${col.name}`, newPhone);
        // Update the row with the new email value
        row[col.name] = newPhone;
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
        >
          <span>{currentPhone}</span>
        </Box>
      </PopoverTrigger>

      <PopoverContent
        width="250px"
        color="gray"
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
            <Input
              type="number"
              defaultValue={currentPhone}
              onBlur={(e) => handlePhoneChange(e.target.value)}
              placeholder="Enter Phone Number"
              size="sm"
              mb="4px"
            />
            <Button
              onClick={() => (window.location.href = `tel:${currentPhone}`)}
              colorScheme="green"
              variant="outline"
              size="sm"
            >
              <LuPhone style={{ width: "17px", height: "17px" }} />
            </Button>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default PhonePopover;
