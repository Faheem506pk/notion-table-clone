import React, { useEffect, useState } from "react";
import { Flex, Button, Heading, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import DrawerNav from "./components/Drawer";

const Navbar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [pageName, setPageName] = useState(localStorage.getItem('pageName') || 'Page Name');
  const [isEditingPageName, setIsEditingPageName] = useState(false);

  // Update local storage whenever the page name changes
  useEffect(() => {
    localStorage.setItem('pageName', pageName);
    document.title = pageName; // Update the document title
  }, [pageName]);

  const handleTaskClick = () => {
    setIsEditingPageName(true);
  };

  const handleTaskBlur = () => {
    setIsEditingPageName(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageName(e.target.value);
  };

  return (
    <Flex align="center" p={4} color="gray">
      <DrawerNav />
      {isEditingPageName ? (
        <input
          type="text"
          value={pageName}
          onChange={handleInputChange} // Corrected this line
          onBlur={handleTaskBlur} // Handle when input loses focus
          autoFocus // Automatically focus on the input when editing starts
          style={{
            fontSize: '31.5px',
            fontWeight: 'bold',
            border: 'none',
            color: 'gray', // Use the same color for consistency
            textDecoration: "underline",
            outline: 'none'
          }}
        />
      ) : (
        <Heading onClick={handleTaskClick}>
          {pageName}
        </Heading>
      )}
      
      <Button onClick={toggleColorMode} variant="outline" colorScheme="whiteAlpha" ml={4}>
        {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      </Button>
    </Flex>
  );
};

export default Navbar;
