import React, { useEffect, useState } from "react";
import { Flex, Heading, useColorMode } from "@chakra-ui/react";
import DrawerNav from "./components/Drawer";
import { IconButton} from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';

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
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
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
        
        </Flex>
          <IconButton
          aria-label="Toggle theme"
          icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
          onClick={toggleColorMode}
          margin={"15px"}
        />
      </div>
    </>
  );
};

export default Navbar;
