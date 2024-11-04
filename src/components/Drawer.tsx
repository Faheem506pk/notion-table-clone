import { AddIcon } from '@chakra-ui/icons';
import {
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    Box,
    FormLabel,
    InputGroup,
    Input,
    InputLeftAddon,
    InputRightAddon,
    Stack,
    Textarea,
    Select,
    useDisclosure,
    Drawer,
   
} from '@chakra-ui/react';
import React from 'react';
import { FaBars } from "react-icons/fa";

function DrawerNav() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [placement, setPlacement] = React.useState('right')
  
    return (
      <>
       
        <Button bg="none" onClick={onOpen}>
        <FaBars />
        </Button>
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth='1px'>Basic Drawer</DrawerHeader>
            <DrawerBody>
              <p>Some contents...</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

export default DrawerNav; 
