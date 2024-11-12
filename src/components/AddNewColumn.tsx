import React from 'react';
import { Button, Tr, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody } from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import { GrTextAlignFull } from 'react-icons/gr';
import { MdNumbers, MdOutlineEmail } from 'react-icons/md';
import { LuPhone } from 'react-icons/lu';
import { FaRegIdCard } from 'react-icons/fa';
import { BsCalendarDate } from 'react-icons/bs';
import { GoSingleSelect, GoTag } from 'react-icons/go';
import { TfiShine } from 'react-icons/tfi';

interface AddNewColumnProps {
  onOpen: () => void;
  isOpen: boolean;
  onClose: () => void;
  setNewColumnType: (type: string) => void;
  setNewColumnName: (name: string) => void;
  handleAddColumn: (type: string, name: string) => void;
}

const AddNewColumn: React.FC<AddNewColumnProps> = ({
  onOpen,
  isOpen,
  onClose,
  setNewColumnType,
  setNewColumnName,
  handleAddColumn
}) => {
  const handleColumnAdd = (type: string, name: string) => {
    setNewColumnType(type);
    setNewColumnName(name);
    handleAddColumn(type, name);
  };

  return (
    <Popover placement="bottom" isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <Button onClick={onOpen} leftIcon={<FaPlus />} textColor="gray.400" bg="none" />
      </PopoverTrigger>
      <PopoverContent style={{ width: '150px' }}>
        <PopoverArrow />
        <PopoverBody overflowY="auto" height="250px">
          <div>
            <Tr>
              <Button
                onClick={() => handleColumnAdd('string', 'Text')}
                bg="none"
                color="gray.500"
                paddingLeft={0}
              >
                <GrTextAlignFull style={{ marginRight: '5px' }} /> Text
              </Button>
            </Tr>
            <Tr>
              <Button
                onClick={() => handleColumnAdd('number', 'Number')}
                bg="none"
                color="gray.500"
                paddingLeft={0}
              >
                <MdNumbers style={{ marginRight: '5px' }} /> Number
              </Button>
            </Tr>
            <Tr>
              <Button
                onClick={() => handleColumnAdd('phone', 'Phone')}
                bg="none"
                color="gray.500"
                paddingLeft={0}
              >
                <LuPhone style={{ marginRight: '5px' }} /> Phone
              </Button>
            </Tr>
            <Tr>
              <Button
                onClick={() => handleColumnAdd('email', 'Email')}
                bg="none"
                color="gray.500"
                paddingLeft={0}
              >
                <MdOutlineEmail style={{ marginRight: '5px' }} /> Email
              </Button>
            </Tr>
            <Tr>
              <Button
                onClick={() => handleColumnAdd('cnic', 'CNIC')}
                bg="none"
                color="gray.500"
                paddingLeft={0}
              >
                <FaRegIdCard style={{ marginRight: '5px' }} /> CNIC
              </Button>
            </Tr>
            <Tr>
              <Button
                onClick={() => handleColumnAdd('date', 'Date')}
                bg="none"
                color="gray.500"
                paddingLeft={0}
              >
                <BsCalendarDate style={{ marginRight: '5px' }} /> Date
              </Button>
            </Tr>
            <Tr>
              <Button
                onClick={() => handleColumnAdd('select', 'Select')}
                bg="none"
                color="gray.500"
                paddingLeft={0}
              >
                <GoSingleSelect style={{ marginRight: '5px' }} /> Select
              </Button>
            </Tr>
            <Tr>
              <Button
                onClick={() => handleColumnAdd('tags', 'Multi-Select')}
                bg="none"
                color="gray.500"
                paddingLeft={0}
              >
                <GoTag style={{ marginRight: '5px' }} /> Multi-Select
              </Button>
            </Tr>
            <Tr>
              <Button
                onClick={() => handleColumnAdd('status', 'Status')}
                bg="none"
                color="gray.500"
                paddingLeft={0}
              >
                <TfiShine style={{ marginRight: '5px' }} /> Status
              </Button>
            </Tr>
          </div>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default AddNewColumn;
