import React, { useRef, useState } from "react";
import {
  Flex,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  VStack,
  HStack,
  Input,
  Box,
  Select,
  Text,
  Switch,
  InputGroup,
  InputLeftElement,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import {
    FaArrowDown,
    FaArrowUp,
    FaSearch,
    FaRegIdCard,
  } from "react-icons/fa";
  import {
    MdNumbers,
    MdDelete,
    MdOutlineEmail,
  } from "react-icons/md";
import { GrTextAlignFull } from "react-icons/gr";
import { GoSingleSelect, GoTag } from "react-icons/go";
import { VscListFlat } from "react-icons/vsc";
import { BsCalendarDate } from "react-icons/bs";
import { TfiShine } from "react-icons/tfi";
import { LuPhone } from "react-icons/lu";


interface ColumnProps {
  col: {
    name: string;
    dataType: string;
  };
  index: number;
  handleChangeColumnName: (index: number, newName: string) => void;
  handleChangeColumnType: (index: number, newType: string) => void;
  sortColumn: (index: number, direction: "asc" | "desc") => void;
  handleMouseDown: (index: number) => (event: React.MouseEvent) => void;
  handleDeleteColumn:(columnName: string) => void;
}

const ColumnPropertyEdit: React.FC<ColumnProps> = ({
  col,
  index,
  handleChangeColumnName,
  handleChangeColumnType,
  sortColumn,
  handleMouseDown,
  handleDeleteColumn
}) => {
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const openAlertDialog = () => setIsAlertOpen(true);
    const closeAlertDialog = () => setIsAlertOpen(false);
    const cancelRef = useRef<HTMLButtonElement | null>(null);

    const confirmDelete = (columnName: string) => {
        handleDeleteColumn(columnName);
        closeAlertDialog();
      };

    const getIconByType = (dataType: string) => {
        // Change parameter name to dataType
        switch (dataType) {
          case "string":
            return <GrTextAlignFull style={{ marginRight: "5px" }} />;
          case "number":
            return <MdNumbers style={{ marginRight: "5px" }} />;
          case "date":
            return <BsCalendarDate style={{ marginRight: "5px" }} />;
          case "select":
            return <GoSingleSelect style={{ marginRight: "5px" }} />;
          case "tags":
            return <GoTag style={{ marginRight: "5px" }} />;
          case "status":
            return <TfiShine style={{ marginRight: "5px" }} />;
          case "cnic":
            return <FaRegIdCard style={{ marginRight: "5px" }} />;
          case "phone":
            return <LuPhone style={{ marginRight: "5px" }} />;
          case "email":
            return <MdOutlineEmail style={{ marginRight: "5px" }} />;
          default:
            return <VscListFlat style={{ marginRight: "5px" }} />;
        }
      };



  return (
    <Flex align="left">
      <Popover placement="bottom">
        <PopoverTrigger>
          <Button
            leftIcon={getIconByType(col.dataType)}
            bg="none"
            textColor="gray.400"
          >
            {col.name}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          color="gray.400"
          borderRadius="lg"
          boxShadow="lg"
          px={0}
          width={"250px"}
          minWidth="200px"
        >
          <PopoverBody>
            <VStack align={"flex-start"} spacing={2}>
              <HStack marginTop={2} fontWeight={"normal"} py={0}>
                <Button padding={"0"} paddingLeft={"5px"} height={"28px"}>
                  {getIconByType(col.dataType)}
                </Button>
                <Input
                  defaultValue={col.name}
                  onBlur={(e) =>
                    handleChangeColumnName(index, e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleChangeColumnName(index, e.currentTarget.value);
                    }
                  }}
                  size="sm"
                  variant="flushed"
                  autoFocus
                />
              </HStack>
              <Box mt={4}>
                <label htmlFor="data-type" style={{ fontSize: "12px" }}>
                  data type
                </label>
                <Select
                  defaultValue={col.dataType}
                  onChange={(e) =>
                    handleChangeColumnType(index, e.target.value)
                  }
                  size="sm"
                  variant="flushed"
                >
                  <option value="string">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="select">Select</option>
                  <option value="tags">Tag</option>
                  <option value="status">Status</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="cnic">CNIC</option>
                </Select>
              </Box>

              <Button
                py={0}
                my={0}
                leftIcon={<FaArrowUp />}
                onClick={() => sortColumn(index, "asc")}
                size="sm"
                variant="ghost"
                color="gray.400"
                justifyContent="start"
                _hover={{ bg: "gray.600" }}
              >
                <Text fontWeight={"normal"}>Sort Ascending</Text>
              </Button>
              <Button
                py={0}
                my={0}
                leftIcon={<FaArrowDown />}
                onClick={() => sortColumn(index, "desc")}
                size="sm"
                variant="ghost"
                color="gray.400"
                justifyContent="start"
                _hover={{ bg: "gray.600" }}
              >
                <Text fontWeight={"normal"}>Sort Descending</Text>
              </Button>

              <InputGroup mb={2}>
                <InputLeftElement pointerEvents="none" fontSize={"12px"} height={"28px"}>
                  <FaSearch color="gray.300" />
                </InputLeftElement>
                <Input
                  fontSize={"14px"}
                  px={2}
                  height={"28px"}
                  type="tel"
                  placeholder="Search"
                />
              </InputGroup>

              <HStack justifyContent={"space-between"} fontSize={"14px"} fontWeight={"normal"} ml={4}>
                <Text textTransform={"capitalize"}>Wrap Column</Text>
                <Switch colorScheme="teal" />
              </HStack>
              <Button
                leftIcon={<MdDelete />}
                color="red.400"
                fontSize={"15px"}
                fontWeight={"normal"}
                marginTop={0}
                size="sm"
                variant="ghost"
                justifyContent="start"
                _hover={{ color: "red.500" }}
                onClick={openAlertDialog}
              >
                <Text>Delete Property</Text>
              </Button>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>

      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={closeAlertDialog}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Deletion
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this column? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeAlertDialog}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={() => confirmDelete(col.name)} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Box
        onMouseDown={handleMouseDown(index)}
        cursor="ew-resize"
        width="10px"
        height="100%"
        position="absolute"
        right="0"
        top="0"
        zIndex="1"
      />
    </Flex>
  );
};

export default ColumnPropertyEdit;
