import React from "react";
import { Box, Flex, Button, Heading, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import DrawerNav  from "./components/Drawer";
const Navbar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex  align="center" p={4}  color="gray">
     
        <DrawerNav/>
      <Heading as="h1" size="lg">Dynamic Notion Table</Heading>
      
      <Button onClick={toggleColorMode} variant="outline" colorScheme="whiteAlpha">
        {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      </Button>
    </Flex>
  );
};

export default Navbar;
